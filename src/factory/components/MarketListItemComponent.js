import React from 'react';
import { Link } from 'react-router';
import BubblePreloader from 'react-bubble-preloader';

const MarketListItemComponent = ({
  address,
  preview
}) => {

  // FULL PREVIEW
  if(preview && !preview.isFetching) {
    const title = preview ? preview.statement : address;
    const balance = preview ? preview.balance : 0;
    return (
      <Link
        key={address}
        to={`/market/${address}`}
        className="list-group-item">
        {title} <span className="pull-right">{balance} ETH</span>
      </Link>
    );
  }

  // SPINNER...
  else if(preview && preview.isFetching) {
    return (
      <li className="list-group-item" key={address}>
        <BubblePreloader
          bubble={{ width: '1rem', height: '1rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#ccc', '#aaa', '#999']}
        />
      </li>
    );
  }

  // ADDRESS
  else {
    return (
      <Link
        to={`/market/${address}`}
        className="list-group-item"
        key={address}>
        {address}
      </Link>
    );
  }
};

export default MarketListItemComponent;
