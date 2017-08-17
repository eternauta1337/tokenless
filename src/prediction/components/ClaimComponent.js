import React from 'react';

const ClaimComponent = ({
  claimAmount,
  claimMethod
}) => {

  const handleButtonClick = function() {
    claimMethod();
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-body">
        <div className="form-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleButtonClick()}>
            Claim {claimAmount} eth
          </button>
          <br/>
          <div>
            <small className="text-muted">
              *You will be able to withdraw your funds after making your claim.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimComponent;
