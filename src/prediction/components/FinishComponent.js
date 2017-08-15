import React from 'react';

const FinishComponent = ({
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
          <div className="form-group">
            <button
              type="button"
              className="btn btn-danger"
              onClick={(evt) => handleDestroyButtonClick()}>
              Withdraw {balance} ETH
            </button>
            <br/>
            <br/>
            <small className="text-info">
              You will be asked to make 2 transactions:<br/>
              1) Claim your prize from the prediction contract.<br/>
              2) Withdraw your prize.
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishComponent;
