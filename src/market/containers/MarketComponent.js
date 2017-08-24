import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router';
import MarketListItemComponent from '../components/PredictionListItemComponent';
import ConnectComponent from '../../common/components/ConnectComponent';
import {
  getPredictionPreview
} from '../actions';
import {
  TARGET_LIVE_NETWORK,
  EXPLORER_URL,
} from "../../constants";

class Market extends React.Component {

  componentWillReceiveProps(nextProps) {

    // Check which previews have been updated.
    if(nextProps.addresses) {
      for(let i = 0; i < nextProps.addresses.length; i++) {
        const address = nextProps.addresses[i];
        const preview = nextProps.previews[address];
        // console.log('preview:', preview);
        if(!preview) {
          nextProps.getPredictionPreview(address);
        }
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

    const showNoItems = this.props.addresses === undefined || (this.props.addresses && this.props.addresses.length === 0);

    return (
      <div className="container">

        <div className="panel panel-primary">
          <div className="panel-body">


              {/* LIST MARKETS PANEL */}
              <div className="">

                {/* NO ITEMS */}
                {showNoItems &&
                  <div className="alert alert-default">
                    <span className="text-muted">
                      No predictions yet.
                    </span>
                  </div>
                }

                {/* LIST */}
                {this.props.addresses && this.props.addresses.length > 0 &&
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

              &nbsp;
              &nbsp;

              {/* LINK TO ABOUT */}
              <Link to="/about">
                <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;
                About
              </Link>

              <br/>
              <br/>

              {/* LINK TO EXPLORER */}
              <a
                href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}address/${this.props.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;
                Explore Contract
              </a>

              {/* FAUCET LINK */}
              {TARGET_LIVE_NETWORK === 'ropsten' &&
                <span>
                  &nbsp;&nbsp;
                  <a
                    href="https://faucet.metamask.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="glyphicon glyphicon-tint" aria-hidden="true"></span>&nbsp;
                    Metamask Faucet
                  </a>
                </span>
              }

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
    getPredictionPreview: (address) => dispatch(getPredictionPreview(address))
  };
};

const MarketComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketComponent;
