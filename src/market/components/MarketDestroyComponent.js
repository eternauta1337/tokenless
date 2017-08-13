import React from 'react';

const MarketDestroyComponent = ({destroyMarket}) => {

  const handleDestroyButtonClick = function() {
    destroyMarket();
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <span>Destroy this market and retrieve your fees</span>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleDestroyButtonClick()}>
            Destroy Market
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketDestroyComponent;
