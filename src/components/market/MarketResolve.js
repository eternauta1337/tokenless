import React from 'react';

const MarketResolve = ({ resolveMarketASync }) => {

  const handleButtonClick = (outcome) => {
    resolveMarketASync(outcome);
  };

  return (
    <div>
      <h2>Resolve this market now:</h2>
      <button onClick={(evt) => handleButtonClick(true)}>Yea</button>
      <button onClick={(evt) => handleButtonClick(true)}>Nay</button>
    </div>
  );
};

export default MarketResolve;
