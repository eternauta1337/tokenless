import React from 'react';
import { connect } from 'react-redux';

import {
  createMarket
} from '../actions';

class CreateMarketComponent extends React.Component {

  handleCreateSubmit() {

    const statement = this.statementInputField.value;
    const duration = this.durationInputField.value;

    this.props.createMarket(statement, duration);
  }

  setStatementInputField(input) {
    this.statementInputField = input;
  }

  setDurationInputField(input) {
    this.durationInputField = input;
  }

  render() {
    return (
      <div className="container">

        {/* TITLE */}
        <div className="page-header">
          <h1>Create a Market</h1>
        </div>

        {/* CREATE MARKET PANEL */}
        <div className="row">
          <div className="panel panel-primary">

            {/* PANEL TITLE */}

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
                </div>

                {/* DURATION */}
                <div className="form-group">
                  <label>Duration:</label>
                  <input
                    className="form-control"
                    placeholder='Enter a duration in blocks.'
                    ref={ref => this.setDurationInputField(ref)}
                    />
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(evt) => this.handleCreateSubmit()}>
                  Create Market
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

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createMarket: (statement, duration) => dispatch(createMarket(statement, duration)),
  };
};

const CreateMarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateMarketComponent);

export default CreateMarketContainer;
