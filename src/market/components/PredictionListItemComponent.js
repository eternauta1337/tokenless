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
    let predictionStateClass = 'success';
    if (preview.predictionState === 1) predictionStateClass = 'warning';
    if (preview.predictionState === 2) predictionStateClass = 'danger';
    if (preview.predictionState === 3) predictionStateClass = 'default';
    return (
      <Link
        to={`/prediction/${address}`}
        className="list-group-item">
        {title}
        <div className="pull-right">
          <span>{balance} ETH</span>&nbsp;
          <span className={`label label-${predictionStateClass}`}>
            {preview.predictionStateStr}
          </span>
        </div>
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
          colors={['#ffbb33', '#FF8800', '#ff4444']}
        />
      </li>
    );
  }

  // ADDRESS
  else {
    return (
      <Link
        to={`/prediction/${address}`}
        className="list-group-item"
        >
        {address}
      </Link>
    );
  }
};

export default MarketListItemComponent;
