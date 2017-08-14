import React from 'react';
import ReactDisqusThread from 'react-disqus-thread';

const MarketDiscussComponent = ({
  marketAddress
}) => {

  const handleNewComment = function() {
    console.log('new comment');
  };

  return (
    <div>
      <ReactDisqusThread
				shortname="tokenless"
				identifier={`tokenless-market-${marketAddress}`}
				title="Market Discussion"
				url={`http://www.example.com/market${marketAddress}`}
				category_id=""
				onNewComment={handleNewComment}/>
    </div>
  );
};

export default MarketDiscussComponent;
