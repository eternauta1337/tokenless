import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import PredictionInfoComponent from '../components/PredictionInfoComponent';
import PredictionBetComponent from '../components/PredictionBetComponent';
import PredictionResolveComponent from '../components/PredictionResolveComponent';
import PredictionWithdrawComponent from '../components/PredictionWithdrawComponent';
import PredictionFinishComponent from '../components/PredictionFinishComponent';
import PredictionWaitComponent from '../components/PredictionWaitComponent';
import PredictionBalancesComponent from '../components/PredictionBalancesComponent';
import PredictionDiscussComponent from '../components/PredictionDiscussComponent';
import '../../styles/index.css';
import {
  resetMarket,
  connectPrediction,
  placeBet,
  resolveMarket,
  withdrawPrize,
  finishPrediction
} from '../actions';

class Prediction extends React.Component {

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
        this.props.connectPrediction(this.props.routeParams.address);
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
          <PredictionInfoComponent
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
              <PredictionBalancesComponent
                playerPositiveBalance={this.props.playerPositiveBalance}
                playerNegativeBalance={this.props.playerNegativeBalance}
                />
            }

          {/* FINISH */}
          {isOwned && this.props.predictionState >= 2 && this.props.blockNumber >= this.props.killBlock &&
            <PredictionFinishComponent
              balance={this.props.balance}
              finishPrediction={this.props.finishPrediction}
              />
          }

          {/* WITHDRAW */}
          {this.props.predictionState === 2 && this.props.blockNumber < this.props.killBlock &&
            <PredictionWithdrawComponent
              estimatePrize={this.props.estimatePrize}
              withdrawPrize={this.props.withdrawPrize}
              />
          }

          {/* RESOLVE */}
          {isOwned && this.props.predictionState === 1 &&
            <PredictionResolveComponent
              resolveMarket={this.props.resolveMarket}
              />
          }

          {/* WAIT */}
          {!isOwned && this.props.predictionState === 1 &&
            <PredictionWaitComponent/>
          }

          {/* BET */}
          {this.props.predictionState === 0 &&
            <PredictionBetComponent
              placeBet={this.props.placeBet}
              />
          }

          {/* COMMENTS */}
          <PredictionDiscussComponent/>

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
    connectPrediction: (address) => dispatch(connectPrediction(address)),
    placeBet: (prediction, value) => dispatch(placeBet(prediction, value)),
    resolveMarket: (outcome) => dispatch(resolveMarket(outcome)),
    withdrawPrize: () => dispatch(withdrawPrize()),
    finishPrediction: () => dispatch(finishPrediction()),
    resetMarket: () => dispatch(resetMarket()),
  };
};

const PredictionComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Prediction);

export default PredictionComponent;
