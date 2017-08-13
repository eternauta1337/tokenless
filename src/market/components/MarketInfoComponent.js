import React from 'react';

const MarketInfoComponent = ({
  positivePredicionBalance,
  negativePredicionBalance,
  isOwned,
  marketState,
  marketStateStr,
  remainingBlocks,
  outcome
}) => {

  let marketStateClass = 'success';
  if(marketState === 1) marketStateClass = 'warning';
  if(marketState === 2 && outcome === false) marketStateClass = 'danger';

  let stateStr = marketStateStr;
  if(marketState === 2) stateStr = `${marketStateStr} for ${outcome ? 'Yea' : 'Nay'}`;

  return (
    <div>

      {/* BET BALANCES */}
      <h3>
        <span className="label label-default align-middle">
          <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;&nbsp;
          {positivePredicionBalance}&nbsp;ETH
        </span>
        &nbsp;|&nbsp;
        <span className="label label-default">
          <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;&nbsp;
          {negativePredicionBalance}&nbsp;ETH
        </span>
      </h3>

      {/* MISC */}
      <ul className='list'>

        {/* OWNED */}
        {isOwned &&
          <li className='list-inline-item'>
            <span className="label label-primary">
              You own this market
            </span>
          </li>
        }

        {/* STATE + OUTCOME + BLOCKS REMAINING */}
        <li className='list-inline-item'>
          <span className={`label label-${marketStateClass}`}>
            {stateStr} ({remainingBlocks})
          </span>
        </li>

      </ul>

      <br/>

    </div>
  );
};

export default MarketInfoComponent;
