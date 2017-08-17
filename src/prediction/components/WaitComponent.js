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
          <p>
            Waiting for the owner to resolve this prodiction.
            This can happen any time now.
            Please come back to check if the prediction has been resolved, and most importantly,
            to see if you have a prize to claim!
          </p>
        }

        {/* PLAYER */}
        {isOwned &&
          <p>
            Waiting for players to withdraw their prizes. You will be able to withdraw your fees
            after the withdrawal end date.
          </p>
        }

      </div>
    </div>
  );
};

export default WaitComponent;
