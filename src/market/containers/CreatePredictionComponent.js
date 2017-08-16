import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datetime';
import * as dateUtil from '../../utils/DateUtil';
import {
  createPrediction
} from '../actions';

class CreatePredictionComponent extends React.Component {

  handleCreateSubmit() {
    const statement = this.statementInputField.value;
    this.props.createPrediction(statement, this.betEndDate, this.withdrawEndDate);
  }

  setStatementInputField(input) {
    this.statementInputField = input;
  }

  render() {

    let betDate = new Date();
    betDate.setDate(betDate.getDate() + dateUtil.secondsToDays(120));
    this.betEndDate = betDate;

    let withdrawDate = new Date();
    withdrawDate.setDate(withdrawDate.getDate() + dateUtil.secondsToDays(160));
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
                    Upon this date, the prediction should be resolved by it's owner to yes or no,
                    meaning that all bets will be closed and that
                    players can start withdrawing prizes.
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
                  {!isNaN(this.props.minWithdrawEndTimestampDelta) &&
                    <small className="text-muted">
                      ( The minimum of this market is {dateUtil.secondsToDays(this.props.minWithdrawEndTimestampDelta)} days )
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
    minWithdrawEndTimestampDelta: state.market.minWithdrawEndTimestampDelta
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
