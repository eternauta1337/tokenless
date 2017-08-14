import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import MarketListItemComponent from '../components/PredictionListItemComponent';
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
      lastRecordedBlockNumber: 0,
      fetching: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.refreshPreviews(nextProps);
  }

  componentWillMount() {
    this.refreshFactory();
    this.refreshPreviews(this.props);
  }

  render() {

    // CONNECTING...
    if(!this.props.isConnected) {
      return <ConnectComponent title="Connecting with the prediction market smart contract..."/>;
    }

    return (
      <div className="container">

        {/* LIST MARKETS PANEL */}
        <div className="row">
          {!this.state.fetching && this.props.addresses.length === 0 &&
            <div className="alert alert-info">
              <strong>
                Sorry, there are currently no predictions... Would you like to create one?
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
          Create a Prediction
        </Link>

      </div>
    );
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
    let fetching = false;
    _.each(props.addresses, (address) => {
        if(!props.previews[address]) {
          props.getMarketPreview(address);
          fetching = true;
          return false;
        }
        else if(props.previews[address].isFetching) return false;
    });
    this.setState({
      fetching
    });
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    addresses: state.market.predictionAddresses,
    previews: state.market.previews,
    isNetworkConnected: state.network.isConnected,
    blockNumber: state.network.blockNumber,
    ...state.market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectFactory: () => dispatch(connectFactory()),
    getMarketPreview: (address) => dispatch(getMarketPreview(address))
  };
};

const ListPredictionsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListMarkets);

export default ListPredictionsComponent;
