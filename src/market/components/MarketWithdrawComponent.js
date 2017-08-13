import React from 'react';

const MarketWithdrawComponent = ({ withdrawPrize }) => {

  const handleWithdrawButtonClick = function() {
    withdrawPrize();
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-heading">
        <span>Would you like to withdraw your prize?</span>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleWithdrawButtonClick()}>
            Withdraw Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketWithdrawComponent;
