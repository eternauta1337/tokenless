import React from 'react';
import BubblePreloader from 'react-bubble-preloader';

const ConnectComponent = ({title}) => {
  return (
    <div className="container">
      <div className="page-header">
        <p className="text-muted">{title}</p>
      </div>
      <div className="row">
        <BubblePreloader
          bubble={{ width: '2rem', height: '2rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#ffbb33', '#FF8800', '#ff4444']}
        />
      </div>
    </div>
  );
};

export default ConnectComponent;
