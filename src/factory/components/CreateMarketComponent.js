import React from 'react';
import { connect } from 'react-redux';

import {
  createMarket
} from '../actions';

class CreateMarketComponent extends React.Component {

  handleSubmitButtonClick() {

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
      <div>
        <label>Create a market:</label>
        <br/>
        <input
          placeholder='Enter a statement'
          ref={ref => this.setStatementInputField(ref)}
          />
        <br/>
        <input
          placeholder='Enter a duration (blocks)'
          ref={ref => this.setDurationInputField(ref)}
          />
        <br/>
        <button onClick={(evt) => this.handleSubmitButtonClick()}>Create</button>
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
