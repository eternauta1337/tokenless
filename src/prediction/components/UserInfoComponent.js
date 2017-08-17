import React from 'react';

const UserInfoComponent = ({
  playerPositiveBalance,
  playerNegativeBalance,
  playerPrizes,
  playerPayments,
  predictionState
}) => {

  if(
    playerPositiveBalance === 0 &&
    playerNegativeBalance === 0 &&
    (!playerPrizes || playerPrizes === 0) &&
    playerPayments === 0
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
            Bets on yes: {playerNegativeBalance} eth
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

        {/* WITHDRAW */}
        { predictionState === 2 && playerPayments > 0 &&
          <div>
            <small className="text-muted">
              Funds to withdraw: {playerPayments} eth
            </small>
          </div>
        }

      </div>
    </div>
  );
};

export default UserInfoComponent;
