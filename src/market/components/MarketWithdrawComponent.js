import React from 'react';

const MarketWithdrawComponent = ({
  estimatePrize,
  withdrawPrize
}) => {

  const handleWithdrawButtonClick = function() {
    withdrawPrize();
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-heading">
        <span>Would you like to withdraw your prize?</span>
      </div>
      <div className="panel-body">
        {estimatePrize > 0 &&
          <form className="">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(evt) => handleWithdrawButtonClick()}>
              Withdraw {estimatePrize} ETH Now
            </button>
          </form>
        }
        {estimatePrize <= 0 &&
          <h4 className="text-muted">
            Sorry, it seems you didn't win anything =(
          </h4>
        }
      </div>
    </div>
  );
};

export default MarketWithdrawComponent;
