import React from 'react';

const PlaceBetComponent = ({
  placeBet,
  isOwned
}) => {

  let betInputField;

  const handleBetSubmit = function(prediction) {

    const bet = betInputField.value;

    // TODO: proper validation
    if(isNaN(bet)) {
      console.log('invalid form parameters');
      return;
    }

    placeBet(prediction, betInputField.value);
  };

  return (
    <div className={`panel panel-${!isOwned ? 'info' : 'default'}`}>
      <div className="panel-heading">
        <strong>Place a bet</strong>
      </div>
      <div className="panel-body">

        {/* OWNER CAN'T BET */}
        { isOwned &&
          <div>
            <h4 className="text-muted">
              Sorry, owner's can't bet on their own predictions.
            </h4>
          </div>
        }

        {/* BET FORM */}
        { !isOwned &&
          <form className="">
            <div className="form-group">
            <input
            className="form-control"
            placeholder='0 Eth'
            ref={ref => betInputField = ref}
            />
            </div>

            {/* YES */}
            <button
            type="button"
            className="btn btn-info"
            onClick={(evt) => handleBetSubmit(true)}>
            Will Happen
            </button>

            &nbsp;
            &nbsp;

            {/* NO */}
            <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleBetSubmit(false)}>
            Won't Happen
            </button>
          </form>
        }

      </div>
    </div>
  );
};

export default PlaceBetComponent;
