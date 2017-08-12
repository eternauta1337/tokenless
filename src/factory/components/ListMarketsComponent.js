import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

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

    // CONNECTING...
    if(!this.props.isConnected) {
      return <ConnectComponent title="Connecting with market factory..."/>;
    }

    return (
      <div className="container">

        {/* TITLE */}
        <div className="page-header">
          <h1>Browse Markets</h1>
        </div>

        {/* CREATE MARKET PANEL */}
        <div className="row">
          <ul className="list-group">
            {_.map(this.props.previews, (preview) => {
              return (
                <li className="list-group-item" key={preview.address}>
                  <Link to={`/market/${preview.address}`}>
                    {preview.statement} <span className="pull-right">{preview.balance} ETH</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* LINK TO CREATE */}
        <Link to="/create">
          <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;
          Create a Market
        </Link>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    previews: state.factory.previews,
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
