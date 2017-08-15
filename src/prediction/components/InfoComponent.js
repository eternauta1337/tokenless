import React from 'react';
import * as dateUtil from '../../utils/DateUtil';
import {
  DEBUG_MODE
} from '../../constants';

const InfoComponent = ({
  positivePredicionBalance,
  negativePredicionBalance,
  isOwned,
  predictionState,
  predictionStateStr,
  daysLeft,
  betEndDate,
  withdrawalEndDate,
  outcome,
  simulatedNow
}) => {

  let predictionStateClass = 'success';
  if (predictionState === 1) predictionStateClass = 'warning';
  if (predictionState === 2 && outcome === false) predictionStateClass = 'danger';

  let stateStr = predictionStateStr;
  if (predictionState === 2) stateStr = `${predictionStateStr} for ${outcome ? 'Yes' : 'No'}`;

  const balanceTotal = positivePredicionBalance + negativePredicionBalance;
  const posPercent = 100 * positivePredicionBalance / balanceTotal;
  const negPercent = 100 * negativePredicionBalance / balanceTotal;

  return (

    <div>

      {/* POT BALANCES */}
      { balanceTotal > 0 &&
        <div className="progress">
          <div className="progress-bar progress-bar-primary" style={{width: `${posPercent}%`}}>
            <span className="">
              <span className="glyphicon glyphicon-thumbs-up"></span>
              &nbsp;
              {positivePredicionBalance}&nbsp;ETH
            </span>
          </div>
          <div className="progress-bar progress-bar-danger" style={{width: `${negPercent}%`}}>
            <span className="">
              <span className="glyphicon glyphicon-thumbs-down"></span>
              &nbsp;
              {negativePredicionBalance}&nbsp;ETH
            </span>
          </div>
        </div>
      }

      {/* BADGES */}
      <ul className='list'>

        {/* DATES */}
        { DEBUG_MODE &&
          <li className='list-inline-item'>
            <span className="label label-warning">
              Simulated date: {dateUtil.dateToStr(dateUtil.unixToDate(simulatedNow))}
            </span>
          </li>
        }
        <li className='list-inline-item'>
          <span className="label label-default">
            Bets end on: {dateUtil.dateToStr(dateUtil.unixToDate(betEndDate))}
          </span>
        </li>
        <li className='list-inline-item'>
          <span className="label label-default">
            Withdrawals end on: {dateUtil.dateToStr(dateUtil.unixToDate(withdrawalEndDate))}
          </span>
        </li>

        {/* OWNED */}
        {isOwned &&
        <li className='list-inline-item'>
            <span className="label label-info">
              You own this prediction
            </span>
        </li>
        }

        {/* STATE + OUTCOME + BLOCKS REMAINING */}
        <li className='list-inline-item'>
          <span className={`label label-${predictionStateClass}`}>
            {stateStr} ({daysLeft} days left)
          </span>
        </li>

      </ul>

      <br/>

    </div>
  );
};

export default InfoComponent;
