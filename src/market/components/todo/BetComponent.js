import React from 'react';

const MarketBet = ({ market, placeBetAsync }) => {

  const handleBetButtonClick = (prediction) => {
    // TODO: use input value
    placeBetAsync(prediction, 1);
  };

  if(market.meta.blocksRemaining > 0) {
    return (
      <div>
        Your current prediction: {market.meta.playerPrediction ? 'yea' : 'nay'}
        <br/>
        Your current prediction balance: {market.meta.playerBalance} eth
        <br/>
        <h2>What is your prediction?</h2>
        <input placeholder='Place your bet here'></input>
        <button onClick={(evt) => handleBetButtonClick(true)}>Yea</button>
        <button onClick={(evt) => handleBetButtonClick(false)}>Nay</button>
      </div>
    );
  }
  else {
    return (
      <div>
        Bets are closed for this market.
        <br/>
        Awaiting resolution...
      </div>
    );
  }
};

export default MarketBet;
