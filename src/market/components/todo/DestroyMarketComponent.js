import React from 'react';

const MarketDestroy = ({ destroyMarketAsync }) => {

  const handleButtonClick = () => {
    destroyMarketAsync();
  };

  return (
    <div>
      <h2>Destroy this market now:</h2>
      <button onClick={(evt) => handleButtonClick()}>Destroy</button>
    </div>
  );
};

export default MarketDestroy;
