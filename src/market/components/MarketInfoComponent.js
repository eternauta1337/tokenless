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
      <br/>
      <ul className='list-inline'>
        {isOwned &&
          <li className='list-inline-item'>
            <span className="label label-primary">
              You own this market
            </span>
          </li>
        }
        {marketState >= 2 &&
          <li className='list-inline-item'>
            <span className="label label-warning">
              Resolved
            </span>
          </li>
        }
        <li className='list-inline-item'>
          <span className={`label label-${marketState === 0 ? 'info' : 'warning'}`}>
            {marketStateStr} {remainingBlocks !== 0 ? `(${remainingBlocks})` : ''}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default MarketInfoComponent;
