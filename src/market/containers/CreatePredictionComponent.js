import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datetime';
import * as dateUtil from '../../utils/DateUtil';
import * as miscUtil from '../../utils/MiscUtil';
import ConnectComponent from '../../common/components/ConnectComponent';
import {
  DEBUG_MODE, TARGET_LIVE_NETWORK
} from '../../constants';
import {
  createPrediction
} from '../actions';

class CreatePredictionComponent extends React.Component {

  handleCreateSubmit() {
    const statement = this.statementInputField.value;
    // console.log('dates:', this.betEndDate, this.withdrawEndDate);
    this.props.createPrediction(statement, this.betEndDate, this.withdrawEndDate);
  }

  setStatementInputField(input) {
    this.statementInputField = input;
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

    // Pre-populate date files with 2 dates in the near future.
    let now = dateUtil.dateToUnix(new Date());
    let betDate = DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? dateUtil.unixToDate(now + 5 * 60) : dateUtil.unixToDate( now + dateUtil.daysToSeconds( 7 ) );
    this.betEndDate = betDate;
    let withdrawDate = DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? dateUtil.unixToDate(now + 10 * 60) : dateUtil.unixToDate( now + dateUtil.daysToSeconds( 14 ) );
    this.withdrawEndDate = withdrawDate;

    return (
      <div className="container">

        {/* CREATE PREDICTION PANEL */}
        <div className="row">
          <div className="panel panel-primary">

            <div className="panel-body">
              <form className="">

                {/* STATEMENT */}
                <div className="form-group">
                  <label>Statement:</label>
                  <input
                    className="form-control"
                    placeholder='Eg. "Ether will surpass bitcoin in 2018."'
                    defaultValue={ DEBUG_MODE ? miscUtil.makeid() : '' }
                    ref={ref => this.setStatementInputField(ref)}
                    />
                  <small className="text-muted">
                    Please enter a falsable and measurable
                    statement that can be answered to yes or no,
                    once the prediction is resolved.
                  </small>
                </div>

                {/* BET END DATE */}
                <div className="form-group">
                  <label>Resolution Date:</label>
                  <DatePicker
                    defaultValue={betDate}
                    onChange={(moment) => this.betEndDate = moment.toDate()}
                  />
                  <small className="text-muted">
                    Upon this date, the prediction can be resolved by it's owner to yes or no,
                    meaning that all bets will be closed and that
                    players can start withdrawing their prizes.
                  </small>
                </div>

                {/* WITHDRAW END DATE */}
                <div className="form-group">
                  <label>Withdraw End Date:</label>
                  <DatePicker
                    defaultValue={withdrawDate}
                    onChange={(moment) => this.withdrawEndDate = moment.toDate()}
                  />
                  <small className="text-muted">
                    After this final date, the owner of the prediction will be able to withdraw his fees
                    (i.e. whatever is left in the balance of the smart contract),
                    and players will no longer be able to withdraw their prizes.
                  </small>
                  <br/>
                  {this.props.minWithdrawEndTimestampDelta !== undefined &&
                   this.props.minWithdrawEndTimestampDelta !== 0 &&
                    <small className="text-muted">
                      (The minimum of this market is {dateUtil.unixToHumanizedDuration(this.props.minWithdrawEndTimestampDelta)}
                       after the resolution date.)
                    </small>
                  }
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  className="btn btn-primary"
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

const CreateMarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePredictionComponent);

export default CreateMarketContainer;
