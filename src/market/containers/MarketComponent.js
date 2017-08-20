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

class Market extends React.Component {

  constructor() {
    super();
    this.state = {
      lastRecordedBlockNumber: 0,
      fetching: false,
      pendingPreviews: []
    };
  }
  
  componentWillMount() {
    this.pendingPreviews = [];
    this.refreshFactory(true);
    this.requestPending();
  }

  shouldComponentUpdate(nextProps) {

    // Check which previews have been updated.
    for(let i = 0; i < nextProps.addresses.length; i++) {
      const address = nextProps.addresses[i];
      const preview = nextProps.previews[address];
      const isPending = this.state.pendingPreviews.includes(address);
      if(preview && isPending) {
        this.state.pendingPreviews.splice(this.state.pendingPreviews.indexOf(address), 1);
      }
    }

    // Render if there are no pending previews.
    return this.pendingPreviews.length === 0;
  }

  componentDidUpdate() {
    this.requestPending();
  }

  requestPending() {

    // Request missing previews.
    let reqCount = 0;
    if(!this.props.addresses) return;
    for(let i = 0; i < this.props.addresses.length; i++) {
      const address = this.props.addresses[i];
      const preview = this.props.previews[address];
      if(!preview) {
        const alreadyPending = this.state.pendingPreviews.includes(address);
        if(!alreadyPending) {

          // Trigger fetch.
          // console.log('will request: ', i);
          this.props.getPredictionPreview(address);
          this.state.pendingPreviews.push(address);

          // Control batch.
          reqCount++;
          if(reqCount >= 1) return;
        }
      }
    }
  }

  refreshFactory(force = false) {
    if (this.props.isNetworkConnected) {
      const blockAdvanced = this.props.blockNumber && (this.props.blockNumber > this.state.lastRecordedBlockNumber);
      if (force || !this.props.isConnected || blockAdvanced) {
        if (this.props.blockNumber) this.setState({lastRecordedBlockNumber: this.props.blockNumber});
        this.props.connectMarket();
      }
    }
  }

  render() {

    // CONNECTING/PROCESSING...
    if(!this.props.isConnected || this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent title={!this.props.isConnected ? "Connecting with smart contract..." : "Processing transaction..."}/>
        </div>
      );
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
                      No predictions yet.
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

const MarketComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketComponent;
