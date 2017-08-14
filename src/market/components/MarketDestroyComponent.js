import React from 'react';

const MarketDestroyComponent = ({
  destroyMarket,
  balance
}) => {

  const handleDestroyButtonClick = function() {
    destroyMarket();
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>Would you like to withdraw your feeds?</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleDestroyButtonClick()}>
            Destroy Market and Withdraw {balance} ETH
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketDestroyComponent;
