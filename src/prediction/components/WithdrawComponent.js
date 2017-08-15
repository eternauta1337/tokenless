import React from 'react';

const WithdrawComponent = ({
  estimatePrize,
  withdrawPrize
}) => {

  const handleWithdrawButtonClick = function() {
    withdrawPrize();
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-heading">
        <strong>This prediction has been resolved, prizes may be withdrawn</strong>
      </div>
      <div className="panel-body">
        {estimatePrize > 0 &&
          <form className="">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(evt) => handleWithdrawButtonClick()}>
              Withdraw {estimatePrize} ETH Now!
            </button>
          </form>
        }
        {estimatePrize <= 0 &&
          <h4 className="text-muted">
            Sorry, there is no balance for you to withdraw.
          </h4>
        }
      </div>
    </div>
  );
};

export default WithdrawComponent;
