import React from 'react';
import * as dateUtil from '../../utils/DateUtil';

const InfoComponent = ({
                         positivePredicionBalance,
                         negativePredicionBalance,
                         isOwned,
                         predictionState,
                         predictionStateStr,
                         betEndDate,
                         withdrawalEndDate,
                         outcome,
                         balance
                       }) => {

  let predictionStateClass = 'success';
  if (predictionState === 1) predictionStateClass = 'warning';
  if (predictionState === 2 && outcome === false) predictionStateClass = 'danger';

  let stateStr = predictionStateStr;
  if (predictionState === 2) stateStr = `${predictionStateStr} for ${outcome ? 'Yes' : 'No'}`;

  const posPercent = 100 * positivePredicionBalance / balance;
  const negPercent = 100 * negativePredicionBalance / balance;

  return (

    <div>

      {/* POT BALANCES */}
      {balance !== undefined && balance > 0 && predictionState !== 3 &&
      <div className="progress">
        <div className="progress-bar progress-bar-primary" style={{width: `${posPercent}%`}}>
          {posPercent > 5 &&
            <span className="">
              <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
              {positivePredicionBalance}&nbsp;ETH
            </span>
          }
        </div>
        <div className="progress-bar progress-bar-danger" style={{width: `${negPercent}%`}}>
          {negPercent > 5 &&
            <span className="">
              <span className="glyphicon glyphicon-thumbs-down"></span>&nbsp;
              {negativePredicionBalance}&nbsp;ETH
            </span>
          }
        </div>
      </div>
      }

      {/* BADGES */}
      <ul className='list'>

        {/* TOTAL BALANCE */}
        {balance !== undefined &&
          <li className='list-inline-item'>
            <span className="label label-info">
              Contract balance: {balance}
            </span>
          </li>
        }

        {/* OWNED */}
        {isOwned &&
        <li className='list-inline-item'>
            <span className="label label-info">
              You own this prediction
            </span>
        </li>
        }

        {/* STATE */}
        <li className='list-inline-item'>
          <span className={`label label-${predictionStateClass}`}>
            {stateStr}
          </span>
        </li>

        {/* DATES */}
        {betEndDate !== undefined && predictionState !== 3 &&
          <li className='list-inline-item'>
            <span className="label label-default">
              Bets end on: {dateUtil.unixToStr(betEndDate)}
            </span>
          </li>
        }
        {withdrawalEndDate !== undefined && predictionState !== 3 &&
          <li className='list-inline-item'>
            <span className="label label-default">
              Withdrawals end on: {dateUtil.unixToStr(withdrawalEndDate)}
            </span>
          </li>
        }

      </ul>

      <br/>

    </div>
  );
};

export default InfoComponent;
