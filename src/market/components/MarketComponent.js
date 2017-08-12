import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import MarketInfoComponent from './MarketInfoComponent';
import MarketBetComponent from './MarketBetComponent';
import '../../styles/index.css';
import {
  resetMarket,
  connectMarket,
  placeBet,
  resolveMarket,
  withdrawPrize,
  destroyMarket
} from '../actions';

class Market extends React.Component {

  constructor() {
    super();
    this.state = {
      lastRecordedBlockNumber: 0
    };
  }

  componentWillMount() {
    this.props.resetMarket();
    this.refreshMarket();
  }

  componentWillReceiveProps() {
    this.refreshMarket();
  }

  refreshMarket() {
    if(this.props.isNetworkConnected) {
      const blockAdvanced = this.props.blockNumber && (this.props.blockNumber > this.state.lastRecordedBlockNumber);
      if(!this.props.isConnected || blockAdvanced) {
        if(this.props.blockNumber) this.setState({ lastRecordedBlockNumber: this.props.blockNumber });
        this.props.connectMarket(this.props.routeParams.address);
      }
    }
  }

  render() {

    // CONNECTING...
    if(!this.props.isConnected) {
      return <ConnectComponent title="Connecting with market..."/>;
    }

    // Pre-process some of the market's data for display.
    const isOwned =
      this.props.activeAccountAddress === this.props.owner;
    let remainingBlocks = 0;
    if(this.props.blockNumber) {
      if(this.props.marketState === 0) {
        remainingBlocks = this.props.endBlock - this.props.blockNumber;
      }
      else if(this.props.marketState >= 1) {
        remainingBlocks = this.props.killBlock - this.props.blockNumber;
      }
    }

    return (
      <div>

        {/* STATEMENT */}
        <div className="page-header">
          <h1 className="market-statement">
            "{this.props.statement}"
          </h1>
        </div>

        <div className="row">

          {/* INFO */}
          <MarketInfoComponent
            positivePredicionBalance={this.props.positivePredicionBalance}
            negativePredicionBalance={this.props.negativePredicionBalance}
            isOwned={isOwned}
            marketState={this.props.marketState}
            marketStateStr={this.props.marketStateStr}
            remainingBlocks={remainingBlocks}
            />

          {/* BET */}
          {this.props.marketState === 0 &&
            <MarketBetComponent
              placeBet={this.props.placeBet}
              />
          }

          {/* RESOLVE */}
          {isOwned && this.props.marketState === 1 &&
            <div>
              <h2>Resolve this market now:</h2>
              <button onClick={(evt) => this.handleResolveButtonClick(true)}>Yea</button>
              <button onClick={(evt) => this.handleResolveButtonClick(false)}>Nay</button>
            </div>
          }

          {/* WITHDRAW */}
          {this.props.marketState === 2 && this.props.blockNumber < this.props.killBlock &&
            <div>
              <button
                onClick={(evt) => this.handleWithdrawButtonClick()}>Withdraw prize</button>
            </div>
          }

          {/* DESTROY */}
          {isOwned && this.props.marketState >= 2 && this.props.blockNumber >= this.props.killBlock &&
            <div>
              <button
                onClick={(evt) => this.handleDestroyButtonClick()}>Destroy</button>
            </div>
          }
        </div>

      </div>
    );
  }

  handleResolveButtonClick(outcome) {
    this.props.resolveMarket(outcome);
  };

  handleWithdrawButtonClick() {
    this.props.withdrawPrize();
  };

  handleDestroyButtonClick() {
    this.props.destroyMarket();
  };
}

const mapStateToProps = (state, ownProps) => {
  // console.log('MarketComponent - state', state);
  return {
    isNetworkConnected: state.network.isConnected,
    activeAccountAddress: state.network.activeAccountAddress,
    blockNumber: state.network.blockNumber,
    ...state.market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectMarket: (address) => dispatch(connectMarket(address)),
    placeBet: (prediction, value) => dispatch(placeBet(prediction, value)),
    resolveMarket: (outcome) => dispatch(resolveMarket(outcome)),
    withdrawPrize: () => dispatch(withdrawPrize()),
    destroyMarket: () => dispatch(destroyMarket()),
    resetMarket: () => dispatch(resetMarket()),
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
