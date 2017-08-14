import React from 'react';
import ReactDisqusThread from 'react-disqus-thread';

const PredictionDiscussComponent = ({
  predictionAddress
}) => {

  const handleNewComment = function() {
    console.log('new comment');
  };

  return (
    <div>
      <ReactDisqusThread
				shortname="tokenless"
				identifier={`tokenless-prediction-${predictionAddress}`}
				title="Market Discussion"
				url={`http://www.example.com/prediction${predictionAddress}`}
				category_id=""
				onNewComment={handleNewComment}/>
    </div>
  );
};

export default PredictionDiscussComponent;
