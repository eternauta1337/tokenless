import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import MarketListItemComponent from '../components/MarketListItemComponent';
import {
  getMarketPreview
} from '../actions';

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

  componentWillReceiveProps(nextProps) {
    this.refreshPreviews(nextProps);
  }

  componentWillMount() {
    this.refreshFactory();
    this.refreshPreviews(this.props);
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

  refreshPreviews(props) {
    _.each(props.addresses, (address) => {
        if(!props.previews[address]) {
          props.getMarketPreview(address);
          return false;
        }
        else if(props.previews[address].isFetching) return false;
    });
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

        {/* LIST MARKETS PANEL */}
        <div className="row">
          {this.props.addresses.length === 0 &&
            <div className="alert alert-info">
              <strong>
                Sorry, there are currently no markets... Would you like to create one?
              </strong>
            </div>
          }
          {this.props.addresses.length > 0 &&
            <ul className="list-group">
              {_.map(this.props.addresses, (address) => {
                const preview = this.props.previews[address];
                return <MarketListItemComponent
                  address={address}
                  preview={preview}
                  />;
              })}
            </ul>
          }
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
    addresses: state.factory.marketAddresses,
    previews: state.factory.previews,
    isNetworkConnected: state.network.isConnected,
    blockNumber: state.network.blockNumber,
    ...state.factory
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectFactory: () => dispatch(connectFactory()),
    getMarketPreview: (address) => dispatch(getMarketPreview(address))
  };
};

const ListMarketsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListMarkets);

export default ListMarketsComponent;
