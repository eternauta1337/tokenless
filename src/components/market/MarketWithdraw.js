import React from 'react';

const MarketWithdraw = ({ market, withdrawPrizeAsync }) => {

  const handleButtonClick = (outcome) => {
    withdrawPrizeAsync(outcome);
  };

  return (
    <div>
      Funds available to withdraw: {market.meta.playerBalance}
      <br/>
      <br/>
      <button
        disabled={market.meta.playerBalance <= 0}
        onClick={(evt) => handleButtonClick()}>Withdraw prize</button>
    </div>
  );
};

export default MarketWithdraw;
