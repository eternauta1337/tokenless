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
          This can happen at any time now.
          Please come back to check if it has been resolved, and
          to see if you have a prize to claim!
        </p>
      </div>
    </div>
  );
};

export default WaitComponent;
