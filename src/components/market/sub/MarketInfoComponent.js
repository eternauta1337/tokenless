import React from 'react';

const MarketInfo = ({ market }) => {
  return (
    <div>
      <ul>
        <li>Yea: {market.meta.positivePredicionBalance} eth</li>
        <li>Nay: {market.meta.negativePredicionBalance} eth</li>
        <li>blocks remaining: {market.meta.blocksRemaining}</li>
        <li>market state: {market.meta.state}</li>
      </ul>
    </div>
  );
};

export default MarketInfo;
