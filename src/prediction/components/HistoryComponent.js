import React from 'react';

const HistoryComponent = ({ playerPositiveBalance, playerNegativeBalance }) => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Your current prediction</strong>
      </div>
      <div className="panel-body">
        Yes: {playerPositiveBalance} ETH<br/>
        No: {playerNegativeBalance} ETH
      </div>
    </div>
  );
};

export default HistoryComponent;
