import React from 'react';

const MarketInfoComponent = ({
  positivePredicionBalance,
  negativePredicionBalance,
  isOwned,
  marketState,
  marketStateStr,
  remainingBlocks
}) => {
  return (
    <div>

      {/* BET BALANCES */}
      <h4>
        <span className="label label-default align-middle">
          <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;&nbsp;
          {positivePredicionBalance}&nbsp;ETH
        </span>
        &nbsp;|&nbsp;
        <span className="label label-default">
          <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;&nbsp;
          {negativePredicionBalance}&nbsp;ETH
        </span>
      </h4>

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

        {/* RESOLVED */}
        {marketState >= 2 &&
          <li className='list-inline-item'>
            <span className="label label-warning">
              Resolved
            </span>
          </li>
        }

        {/* STATE + BLOCKS REMAINING */}
        <li className='list-inline-item'>
          <span className={`label label-${marketState === 0 ? 'info' : 'warning'}`}>
            {marketStateStr} {remainingBlocks !== 0 ? `(${remainingBlocks})` : ''}
          </span>
        </li>

      </ul>

      <br/>

    </div>
  );
};

export default MarketInfoComponent;
