import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ConnectComponent from '../../components/common/ConnectComponent';

import {
  connectFactory
} from '../actions';

class ListMarkets extends React.Component {

  componentWillMount() {

    // Fetch factory?
    console.log('ListMarketsComponent - componentWillReceiveProps()',
      this.props.isNetworkConnected,
      this.props.isConnected
    );
    if(this.props.isNetworkConnected) {
      if(!this.props.isConnected) {
        this.props.connectFactory();
      }
    }
  }

  render() {

    if(!this.props.isConnected) {
      return (
        <div>
          Attempting to connect with market factory:
          <ConnectComponent/>
        </div>
      );
    }

    console.log('markets:', this.props.markets);

    return (
      <div>
        <ul>
          {this.props.markets.map((market) => {
            return (
              <li key={market}><Link to={`/market/${market}`}>{market}</Link></li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    markets: state.factory.marketAddresses,
    isNetworkConnected: state.network.isConnected,
    ...state.factory
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectFactory: () => dispatch(connectFactory())
  };
};

const ListMarketsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListMarkets);

export default ListMarketsComponent;
