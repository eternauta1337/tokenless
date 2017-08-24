import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datetime';
import * as dateUtil from '../../utils/DateUtil';
import * as miscUtil from '../../utils/MiscUtil';
import { form } from 'react-inform';
import ConnectComponent from '../../common/components/ConnectComponent';
import _ from 'lodash';
import {
  DEBUG_MODE, TARGET_LIVE_NETWORK
} from '../../constants';
import {
  createPrediction
} from '../actions';

class CreatePredictionComponent extends React.Component {

  componentDidMount() {

    // Pre-populate date files with 2 dates in the near future.
    let now = dateUtil.dateToUnix(new Date());
    let betEndDate = DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? dateUtil.unixToDate(now + 5 * 60) : dateUtil.unixToDate( now + dateUtil.daysToSeconds( 7 ) );
    let withdrawEndDate = DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? dateUtil.unixToDate(now + 10 * 60) : dateUtil.unixToDate( now + dateUtil.daysToSeconds( 14 ) );

    this.props.form.onValues({
      statement: DEBUG_MODE ? miscUtil.makeid() : '',
      betEndDate,
      withdrawEndDate
    });
  }

  handleCreateSubmit() {
    const { statement, betEndDate, withdrawEndDate } = this.props.fields;
    this.props.form.forceValidate();
    if(!this.props.form.isValid()) return;
    this.props.createPrediction(
      statement.value,
      betEndDate.value,
      withdrawEndDate.value
    );
  }

  render() {

    // CONNECTING/PROCESSING...
    if(this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent title="Processing transaction..." useGif={true}/>
        </div>
      );
    }

    const { statement, betEndDate, withdrawEndDate } = this.props.fields;

    return (
      <div className="container">

        {/* CREATE PREDICTION PANEL */}
        <div className="row">
          <div className="panel panel-info">

            <div className="panel-body">
              <form className="">

                {/* STATEMENT */}
                <div className={`form-group ${statement.error ? 'has-danger' : ''}`}>
                  <label>Statement:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder='Eg. "Ether will surpass bitcoin in 2018."'
                    {...statement.props}
                    />
                  <small className="text-muted">
                    Please enter a falsable and measurable
                    statement that can be answered to yes or no,
                    once the prediction is resolved.
                  </small>
                  <div className="text-danger">
                    {statement.error}
                  </div>
                </div>

                {/* BET END DATE */}
                <div className={`form-group ${betEndDate.error ? 'has-danger' : ''}`}>
                  <label>Resolution Date:</label>
                  <DatePicker
                    {...betEndDate.props}
                  />
                  <small className="text-muted">
                    Upon this date, the prediction can be resolved by it's owner to yes or no,
                    meaning that all bets will be closed and that
                    players can start withdrawing their prizes.
                  </small>
                  <div className="text-danger">
                    {betEndDate.error}
                  </div>
                </div>

                {/* WITHDRAW END DATE */}
                <div className={`form-group ${withdrawEndDate.error ? 'has-danger' : ''}`}>
                  <label>Withdraw End Date:</label>
                  <DatePicker
                    {...withdrawEndDate.props}
                  />
                  <small className="text-muted">
                    After this final date, the owner of the prediction will be able to withdraw his fees
                    (i.e. whatever is left in the balance of the smart contract),
                    and players will no longer be able to withdraw their prizes.
                  </small>
                  <div className="text-danger">
                    {withdrawEndDate.error}
                  </div>
                  {this.props.minWithdrawEndTimestampDelta !== undefined &&
                   this.props.minWithdrawEndTimestampDelta !== 0 &&
                    <small className="text-muted">
                      (The minimum of this market is {dateUtil.unixToHumanizedDuration(this.props.minWithdrawEndTimestampDelta)}
                       &nbsp;after the resolution date.)
                    </small>
                  }
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={(evt) => this.handleCreateSubmit()}>
                  Create Prediction
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  CreatePredictionComponent.minWithdrawEndTimestampDelta = state.market.minWithdrawEndTimestampDelta;
  return {
    bcTimestamp: state.network.currentTime,
    minWithdrawEndTimestampDelta: state.market.minWithdrawEndTimestampDelta,
    isWaiting: state.network.isWaiting
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPrediction: (statement, betEndDate, withdrawEndDate) => dispatch(createPrediction(statement, betEndDate, withdrawEndDate)),
  };
};

const fields = ['statement', 'betEndDate', 'withdrawEndDate'];
const validate = values => {
  // console.log('validate', values);

  const { statement, betEndDate, withdrawEndDate } = values;
  const errors = {};

  if (!statement || statement.length === 0) errors.statement = 'Statement is required.';

  const nowUnix = dateUtil.dateToUnix(new Date());
  if(betEndDate) {
    const betEndUnix = betEndDate.valueOf() / 1000;
    if(betEndUnix <= nowUnix) errors.betEndDate = 'Please enter a later bet end date.';
  }
  else errors.betEndDate = 'Bet end date is required.';

  if(withdrawEndDate) {
    const withdrawEndUnix = withdrawEndDate.valueOf() / 1000;
    const betEndUnix = betEndDate.valueOf() / 1000;
    const delta = withdrawEndUnix - betEndUnix;
    const minDelta = CreatePredictionComponent.minWithdrawEndTimestampDelta ? CreatePredictionComponent.minWithdrawEndTimestampDelta : 0;
    if(delta < minDelta) errors.withdrawEndDate = 'Please enter a later withdrawal end date.';
  }
  else errors.withdrawEndDate = 'Withdrawal end date is required.';

  return errors;
};

const CreateMarketContainer = form({
  fields,
  validate
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePredictionComponent));

export default CreateMarketContainer;
