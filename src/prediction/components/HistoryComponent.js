import React from 'react';

const HistoryComponent = ({ playerPositiveBalance, playerNegativeBalance }) => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Your current prediction</strong>
      </div>
      <div className="panel-body">
        Yea: {playerPositiveBalance} ETH<br/>
        Nay: {playerNegativeBalance} ETH
      </div>
    </div>
  );
};

export default HistoryComponent;
