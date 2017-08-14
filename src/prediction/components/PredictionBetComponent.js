import React from 'react';

const PredictionBetComponent = ({ placeBet }) => {

  let betInputField;
  let predictionSelector;

  const handleBetSubmit = function(prediction) {

    const bet = betInputField.value;

    // TODO: proper validation
    if(isNaN(bet)) {
      console.log('invalid form parameters');
      return;
    }

    placeBet(prediction, betInputField.value);
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-heading">
        <strong>Place a new bet</strong>
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

          {/* YES */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleBetSubmit(true)}>
            Will Happen
          </button>

          &nbsp;
          &nbsp;

          {/* NO */}
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleBetSubmit(false)}>
            Won't Happen
          </button>
        </form>
      </div>
    </div>
  );
};

export default PredictionBetComponent;
