import React from 'react';

const WithdrawFundsComponent = ({
                               withdrawFunds,
                               payments
                             }) => {

  const handleButtonClick = function() {
    withdrawFunds();
  };

  return (
    <div className='panel panel-info'>
      <div className="panel-body">

        {/* YES PRIZE! */}
        <div className="form-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleButtonClick()}>
            Withdraw {payments} ETH Now!
          </button>
          <br/>
          <div>
            <small className="text-muted">
              You have claimed your prize and your funds are ready to be withdrawn.
              Congratulations :D
            </small>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WithdrawFundsComponent;
