import React from 'react';

const WaitComponent = () => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Waiting for this prediction to be resolved by it's owner</strong>
      </div>
      <div className="panel-body">
        <p>
          The owner of this prediction needs to submit it's resolution.
          This can happen any time now.
          Please come back to check if the prediction has been resolved, and most importantly,
          to see if you have a prize to claim!
        </p>
      </div>
    </div>
  );
};

export default WaitComponent;
