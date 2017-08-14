import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import MarketInfoComponent from '../components/PredictionInfoComponent';
import MarketBetComponent from '../components/PredictionBetComponent';
import MarketResolveComponent from '../components/PredictionResolveComponent';
import MarketWithdrawComponent from '../components/PredictionWithdrawComponent';
import MarketDestroyComponent from '../components/PredictionDestroyComponent';
import MarketWaitComponent from '../components/PredictionWaitComponent';
import MarketBalancesComponent from '../components/PredictionBalancesComponent';
import MarketDiscussComponent from '../components/PredictionDiscussComponent';
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
      lastRecordedBlockNumber: 0,
      lastRecordedPlayerAddress: ''
    };
  }

  componentWillMount() {
    this.props.resetMarket();
    this.refreshMarket();
  }

  componentWillReceiveProps(nextProps) {
    this.refreshMarket();
  }

  refreshMarket() {
    if(this.props.isNetworkConnected) {
      const blockAdvanced = this.props.blockNumber && (this.props.blockNumber > this.state.lastRecordedBlockNumber);
      const addressChanged = this.props.activeAccountAddress !== this.state.lastRecordedPlayerAddress;
      if(!this.props.isConnected || blockAdvanced || addressChanged) {
        if(this.props.blockNumber) this.setState({ lastRecordedBlockNumber: this.props.blockNumber });
        if(this.props.blockNumber) this.setState({ lastRecordedPlayerAddress: this.props.activeAccountAddress });
        this.props.connectMarket(this.props.routeParams.address);
      }
    }
  }

  render() {

    // CONNECTING...
    if(!this.props.isConnected) {
      return <ConnectComponent title="Connecting with prediction contract..."/>;
    }

    // Pre-process some of the prediction's data for display.
    const isOwned =
      this.props.activeAccountAddress === this.props.owner;
    let remainingBlocks = 0;
    if(this.props.blockNumber) {
      if(this.props.predictionState === 0) {
        remainingBlocks = this.props.endBlock - this.props.blockNumber;
      }
      else if(this.props.predictionState >= 1) {
        remainingBlocks = this.props.killBlock - this.props.blockNumber;
      }
    }

    return (
      <div className="container">

        {/* STATEMENT */}
        <div className="page-header">
          <h1 className="prediction-statement">
            "{this.props.statement}"
          </h1>
        </div>

        <div className="">

          {/* INFO */}
          <MarketInfoComponent
            positivePredicionBalance={this.props.positivePredicionBalance}
            negativePredicionBalance={this.props.negativePredicionBalance}
            isOwned={isOwned}
            predictionState={this.props.predictionState}
            predictionStateStr={this.props.predictionStateStr}
            remainingBlocks={remainingBlocks}
            outcome={this.props.outcome}
            />

          {/* BALANCES */}
            {this.props.predictionState === 0 &&
              <MarketBalancesComponent
                playerPositiveBalance={this.props.playerPositiveBalance}
                playerNegativeBalance={this.props.playerNegativeBalance}
                />
            }

          {/* DESTROY */}
          {isOwned && this.props.predictionState >= 2 && this.props.blockNumber >= this.props.killBlock &&
            <MarketDestroyComponent
              balance={this.props.balance}
              destroyMarket={this.props.destroyMarket}
              />
          }

          {/* WITHDRAW */}
          {this.props.predictionState === 2 && this.props.blockNumber < this.props.killBlock &&
            <MarketWithdrawComponent
              estimatePrize={this.props.estimatePrize}
              withdrawPrize={this.props.withdrawPrize}
              />
          }

          {/* RESOLVE */}
          {isOwned && this.props.predictionState === 1 &&
            <MarketResolveComponent
              resolveMarket={this.props.resolveMarket}
              />
          }

          {/* WAIT */}
          {!isOwned && this.props.predictionState === 1 &&
            <MarketWaitComponent/>
          }

          {/* BET */}
          {this.props.predictionState === 0 &&
            <MarketBetComponent
              placeBet={this.props.placeBet}
              />
          }

          {/* COMMENTS */}
          <MarketDiscussComponent/>

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('PredictionComponent - state', state);
  return {
    isNetworkConnected: state.network.isConnected,
    activeAccountAddress: state.network.activeAccountAddress,
    blockNumber: state.network.blockNumber,
    ...state.prediction
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
