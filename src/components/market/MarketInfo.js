import React from 'react';

const MarketInfo = ({ market }) => {
  return (
    <div>
      <ul>
        <li>Yea: 722 votes (3500 eth)</li>
        <li>Nay: 328 votes (250 eth)</li>
        <li>blocks remaining: {market.meta.blocksRemaining}</li>
        <li>owned by user: {market.meta.isOwnedByUser ? 'true' : 'false'}</li>
      </ul>
    </div>
  );
};

export default MarketInfo;
