import React from 'react';

const MarketInfoComponent = ({
  positivePredicionBalance,
  negativePredicionBalance,
  isOwned,
  marketState,
  marketStateStr,
  remainingBlocks
}) => {

  let marketStateClass = 'success';
  if(marketState === 1) marketStateClass = 'warning';
  if(marketState === 2) marketStateClass = 'success';

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

        {/* STATE + BLOCKS REMAINING */}
        <li className='list-inline-item'>
          <span className={`label label-${marketStateClass}`}>
            {marketStateStr} {remainingBlocks !== 0 ? `(${remainingBlocks})` : ''}
          </span>
        </li>

      </ul>

      <br/>

    </div>
  );
};

export default MarketInfoComponent;
