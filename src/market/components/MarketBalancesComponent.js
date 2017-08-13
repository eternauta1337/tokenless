import React from 'react';

const MarketBalancesComponent = ({ playerPositiveBalance, playerNegativeBalance }) => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <span>Your current prediction</span>
      </div>
      <div className="panel-body">
        Yea: {playerPositiveBalance} ETH<br/>
        Nay: {playerNegativeBalance} ETH
      </div>
    </div>
  );
};

export default MarketBalancesComponent;
