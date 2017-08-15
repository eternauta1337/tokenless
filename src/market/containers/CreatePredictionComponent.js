import React from 'react';
import { connect } from 'react-redux';
import * as dateUtil from '../../utils/DateUtil';
import {
  createPrediction
} from '../actions';

class CreatePredictionComponent extends React.Component {

  handleCreateSubmit() {
    const statement = this.statementInputField.value;
    const betEndDate = new Date(this.betEndDateField.value);
    const withdrawEndDate = new Date(this.withdrawEndDateField.value);
    this.props.createPrediction(statement, betEndDate, withdrawEndDate);
  }

  setStatementInputField(input) {
    this.statementInputField = input;
  }

  render() {

    let betDate = new Date();
    betDate.setDate(betDate.getDate() + 7);

    let withdrawDate = new Date();
    withdrawDate.setDate(withdrawDate.getDate() + 14);

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
                    statement that can be reduced to yes/no
                    once the prediction is resolved.
                  </small>
                </div>

                {/* BET END DATE */}
                <div className="form-group">
                  <label>Resolution Date:</label>
                  <input
                    className="form-control"
                    type="date"
                    defaultValue={dateUtil.dateToStr(betDate, 'yyyy-mm-dd')}
                    ref={ref => this.betEndDateField = ref}
                    />
                  <small className="text-muted">
                    Upon this date, the prediction should be resolvable to yes or no, meaning
                    that all bets will be closed and that players can start withdrawing their prizes.
                  </small>
                </div>

                {/* WITHDRAW END DATE */}
                <div className="form-group">
                  <label>Withdraw End Date:</label>
                  <input
                    className="form-control"
                    type="date"
                    defaultValue={dateUtil.dateToStr(withdrawDate, 'yyyy-mm-dd')}
                    ref={ref => this.withdrawEndDateField = ref}
                  />
                  <small className="text-muted">
                    After this date the owner of the prediction will be able to withdraw his fees
                    (the full balance of the smart contract),
                    and players will no longer be able to withdraw their prizes.
                  </small>
                  <br/>
                  {this.props.minWithdrawEndTimestampDelta &&
                    <small>
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
