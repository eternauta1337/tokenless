import React from 'react';

const MarketBetComponent = ({ placeBet }) => {

  let betInputField;
  let predictionSelector;

  const handleBetSubmit = function(evt) {

    const bet = betInputField.value;
    const prediction = +predictionSelector.options[
      predictionSelector.selectedIndex].value;

    // TODO: proper validation
    if(prediction !== 0 && prediction !== 1) {
      console.log('invalid form parameters');
      return;
    }
    if(isNaN(bet)) {
      console.log('invalid form parameters');
      return;
    }

    placeBet(prediction, betInputField.value);
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-heading">
        <strong>Would you like to make a new prediction?</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <div className="form-group">
            <input
              className="form-control"
              placeholder='0 Eth'
              ref={ref => betInputField = ref}
              />
          </div>
          <div className="form-group">
            <select
              ref={ref => predictionSelector = ref}
              className="custom-select mb-2 mr-sm-2 mb-sm-0">
              <option defaultValue>Outcome...</option>
              <option value="1">Yea</option>
              <option value="0">Nay</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleBetSubmit()}>
            Submit Your Prediction
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketBetComponent;
