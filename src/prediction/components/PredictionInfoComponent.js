import React from 'react';

const PredictionInfoComponent = ({
  positivePredicionBalance,
  negativePredicionBalance,
  isOwned,
  predictionState,
  predictionStateStr,
  remainingBlocks,
  outcome
}) => {

  let predictionStateClass = 'success';
  if(predictionState === 1) predictionStateClass = 'warning';
  if(predictionState === 2 && outcome === false) predictionStateClass = 'danger';

  let stateStr = predictionStateStr;
  if(predictionState === 2) stateStr = `${predictionStateStr} for ${outcome ? 'Yea' : 'Nay'}`;

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
              You own this prediction
            </span>
          </li>
        }

        {/* STATE + OUTCOME + BLOCKS REMAINING */}
        <li className='list-inline-item'>
          <span className={`label label-${predictionStateClass}`}>
            {stateStr} ({remainingBlocks})
          </span>
        </li>

      </ul>

      <br/>

    </div>
  );
};

export default PredictionInfoComponent;
