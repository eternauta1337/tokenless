import React from 'react';

const MarketResolveComponent = ({ resolveMarket }) => {

  let outcomeSelector;

  const handleResolveButtonClick = function() {
    const outcome = +outcomeSelector.options[
      outcomeSelector.selectedIndex].value;

    // TODO: proper validation
    if(outcome !== 0 && outcome !== 1) {
      console.log('invalid form parameters');
      return;
    }

    resolveMarket(outcome);
  };

  return (
    <div className='panel panel-warning'>
      <div className="panel-heading">
        <strong>Resolve this market now</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <div className="form-group">
            <select
              ref={ref => outcomeSelector = ref}
              className="custom-select mb-2 mr-sm-2 mb-sm-0">
              <option defaultValue>Outcome...</option>
              <option value="1">Yea</option>
              <option value="0">Nay</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleResolveButtonClick()}>
            Submit Market Resolution
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketResolveComponent;
