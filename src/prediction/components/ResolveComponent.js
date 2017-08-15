import React from 'react';

const ResolveComponent = ({ resolveMarket }) => {

  const handleResolveButtonClick = function(outcome) {
    resolveMarket(outcome);
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>You may resolve this prediction now</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(evt) => handleResolveButtonClick(true)}>
            The Prediction Ocurred
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleResolveButtonClick(false)}>
            The Prediction did not Occur
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResolveComponent;
