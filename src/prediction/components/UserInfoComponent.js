import React from 'react';

const UserInfoComponent = ({
  playerPositiveBalance,
  playerNegativeBalance,
  playerPrizes,
  predictionState
}) => {

  // Dont show if invalid.
  if(
    playerPositiveBalance === undefined ||
    playerNegativeBalance === undefined
  ) return null;

  // Don't show if empty.
  if(
    playerPositiveBalance === 0 &&
    playerNegativeBalance === 0 &&
    (!playerPrizes || playerPrizes === 0)
  ) return null;

  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Where you stand</strong>
      </div>
      <div className="panel-body">

        {/* BALANCES */}
        { playerPositiveBalance > 0 &&
          <div>
            <small className="text-muted">
              Bets on yes: {playerPositiveBalance} eth
            </small>
          </div>
        }
        { playerNegativeBalance > 0 &&
        <div>
          <small className="text-muted">
            Bets on no: {playerNegativeBalance} eth
          </small>
        </div>
        }

        {/* PRIZE */}
        { predictionState === 2 && playerPrizes > 0 &&
          <div>
            <small className="text-muted">
              Prize to claim: {playerPrizes} eth
            </small>
          </div>
        }

      </div>
    </div>
  );
};

export default UserInfoComponent;
