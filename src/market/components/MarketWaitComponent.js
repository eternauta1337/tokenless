import React from 'react';

const MarketWaitComponent = () => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Waiting for market resolution</strong>
      </div>
      <div className="panel-body">
        <p>
          The owner of this market needs to submit it's resolution.
          Please come back to check if it has been resolved, and
          to see if you have a prize to withdraw.
        </p>
      </div>
    </div>
  );
};

export default MarketWaitComponent;
