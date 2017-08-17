import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router';
import MarketListItemComponent from '../components/PredictionListItemComponent';
import ConnectComponent from '../../common/components/ConnectComponent';
import {
  getPredictionPreview,
  connectMarket
} from '../actions';
import {
  TARGET_LIVE_NETWORK,
  EXPLORER_URL
} from "../../constants";

class ListPredictions extends React.Component {

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
    if (!this.props.isConnected) {
      return <ConnectComponent title="Connecting with the prediction market smart contract..."/>;
    }

    return (
      <div className="container">

        <div className="panel panel-primary">
          <div className="panel-body">


              {/* LIST MARKETS PANEL */}
              <div className="">

                {/* NO ITEMS */}
                {!this.state.fetching && this.props.addresses.length === 0 &&
                  <div className="alert alert-default">
                    <span className="text-muted">
                      No predictions exist. Be the first to create one...
                    </span>
                  </div>
                }

                {/* LIST */}
                {this.props.addresses.length > 0 &&
                  <ul className="list-group">
                    {_.map(this.props.addresses, (address) => {
                      const preview = this.props.previews[address];
                      return <MarketListItemComponent
                        key={address}
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
                Create a New Prediction
              </Link>

              <br/>
              <br/>

              {/* LINK TO EXPLORER */}
              <div>
                <a
                  href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}address/${this.props.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;
                  Explore Contract
                </a>
              </div>

            </div>

          </div>
        </div>
    );
  }

  refreshFactory() {
    if (this.props.isNetworkConnected) {
      const blockAdvanced = this.props.blockNumber && (this.props.blockNumber > this.state.lastRecordedBlockNumber);
      if (!this.props.isConnected || blockAdvanced) {
        if (this.props.blockNumber) this.setState({lastRecordedBlockNumber: this.props.blockNumber});
        this.props.connectMarket();
      }
    }
  }

  refreshPreviews(props) {
    let fetching = false;
    _.each(props.addresses, (address) => {
      if (!props.previews[address]) {
        props.getPredictionPreview(address);
        fetching = true;
        return false;
      }
      else if (props.previews[address].isFetching) return false;
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
    connectMarket: () => dispatch(connectMarket()),
    getPredictionPreview: (address) => dispatch(getPredictionPreview(address))
  };
};

const ListPredictionsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPredictions);

export default ListPredictionsComponent;
