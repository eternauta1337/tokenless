import React from 'react';
import { connect } from 'react-redux';
import {
  createPrediction
} from '../actions';

class CreatePredictionComponent extends React.Component {

  handleCreateSubmit() {

    const statement = this.statementInputField.value;
    const duration = this.durationInputField.value;

    this.props.createPrediction(statement, duration);
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

        {/* CREATE PREDICTION PANEL */}
        <div className="row">
          <div className="panel panel-primary">

            {/* PANEL TITLE */}
            <div className="panel-heading">
              <strong>Create your prediction</strong>
            </div>

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

                {/* DURATION */}
                <div className="form-group">
                  <label>Duration:</label>
                  <input
                    className="form-control"
                    placeholder='Enter a duration in blocks'
                    ref={ref => this.setDurationInputField(ref)}
                    />
                  <small className="text-muted">
                    Keep in mind that in this resolution event,
                    the prediction will have to be resolved to yes/no.
                  </small>
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

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPrediction: (statement, duration) => dispatch(createPrediction(statement, duration)),
  };
};

const CreateMarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePredictionComponent);

export default CreateMarketContainer;
