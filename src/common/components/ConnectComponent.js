import React from 'react';
import BubblePreloader from 'react-bubble-preloader';
import RandomGifComponent from '../../common/components/RandomGifComponent';

const ConnectComponent = ({title}) => {
  return (
    <div className="container">
      <div className="page-header">
        <p className="text-muted">{title}</p>
        <BubblePreloader
          bubble={{ width: '1rem', height: '1rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#ffbb33', '#FF8800', '#ff4444']}
        />
      </div>
      <RandomGifComponent/>
    </div>
  );
};

export default ConnectComponent;
