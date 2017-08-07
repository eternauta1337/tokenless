import React from 'react';

const MarketBet = ({ market, placeBetAsync }) => {

  const handleButtonClick = (prediction) => {
    // TODO: use input value
    placeBetAsync(prediction, 1);
  };

  return (
    <div>
      Your current prediction: {market.meta.playerPrediction}
      Your current prediction balance: {market.meta.playerBalance}
      <br/>
      <h2>What is your prediction?</h2>
      <input placeholder='Place your bet here'></input>
      <button onClick={(evt) => handleButtonClick(true)}>Yea</button>
      <button onClick={(evt) => handleButtonClick(false)}>Nay</button>
    </div>
  );
};

export default MarketBet;
