import React from 'react';
import BubblePreloader from 'react-bubble-preloader';

const ConnectComponent = ({title}) => {
  return (
    <div>
      <h4>{title}</h4>
      <BubblePreloader
        bubble={{ width: '2rem', height: '2rem' }}
        animation={{ speed: 2 }}
        className=""
        colors={['#ffbb33', '#FF8800', '#ff4444']}
      />
    </div>
  );
};

export default ConnectComponent;
