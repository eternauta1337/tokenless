import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ConnectComponent from '../../common/components/ConnectComponent';

import {
  connectFactory
} from '../actions';

class ListMarkets extends React.Component {

  constructor() {
    super();
    this.state = {
      lastRecordedBlockNumber: 0
    };
  }

  componentWillMount() {
    this.refreshFactory();
  }

  refreshFactory() {
    if(this.props.isNetworkConnected) {
      const blockAdvanced = this.props.blockNumber && (this.props.blockNumber > this.state.lastRecordedBlockNumber);
      if(!this.props.isConnected || blockAdvanced) {
        if(this.props.blockNumber) this.setState({ lastRecordedBlockNumber: this.props.blockNumber });
        this.props.connectFactory();
      }
    }
  }

  render() {
    
    if(!this.props.isConnected) {
      return <ConnectComponent title="Connecting with market factory..."/>;
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
    blockNumber: state.network.blockNumber,
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
