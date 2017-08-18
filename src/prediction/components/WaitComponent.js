import React from 'react';

const WaitComponent = ({ isOwned }) => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Waiting...</strong>
      </div>
      <div className="panel-body">

        {/* OWNER */}
        {!isOwned &&
          <h4>
            Waiting for the owner to resolve this prediction.
            This can happen any time now.
            Please come back to check if the prediction has been resolved, and most importantly,
            to see if you have a prize to claim!
          </h4>
        }

        {/* PLAYER */}
        {isOwned &&
          <h4>
            Waiting for players to withdraw their prizes. You will be able to withdraw your fees
            after the withdrawal end date.
          </h4>
        }

      </div>
    </div>
  );
};

export default WaitComponent;
