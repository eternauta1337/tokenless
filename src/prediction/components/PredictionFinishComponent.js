import React from 'react';

const PredictionFinishComponent = ({
  finishPrediction,
  balance
}) => {

  const handleDestroyButtonClick = function() {
    finishPrediction();
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>Would you like to withdraw your fees?</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleDestroyButtonClick()}>
            Withdraw {balance} ETH
          </button>
        </form>
      </div>
    </div>
  );
};

export default PredictionFinishComponent;
