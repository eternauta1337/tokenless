import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import InfoComponent from '../components/InfoComponent';
import PlaceBetComponent from '../components/PlaceBetComponent';
import ResolveComponent from '../components/ResolveComponent';
import WithdrawComponent from '../components/WithdrawComponent';
import FinishComponent from '../components/FinishComponent';
import WaitComponent from '../components/WaitComponent';
import HistoryComponent from '../components/HistoryComponent';
import CommentsComponent from '../components/CommentsComponent';
import * as dateUtil from '../../utils/DateUtil';
import * as web3Util from '../../utils/Web3Util';
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
      return <ConnectComponent title="Connecting with the prediction smart contract..."/>;
    }

    // Pre-process some of the prediction's data for display.
    const isOwned =
      this.props.activeAccountAddress === this.props.owner;
    let now = web3Util.getTimestamp(this.props.web3);
    let daysLeft;
    if(this.props.predictionState === 0) {
      daysLeft = dateUtil.secondsToDays(this.props.betEndDate - now);
    }
    else {
      daysLeft = dateUtil.secondsToDays(this.props.withdrawEndDate - now);
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
          <InfoComponent
            positivePredicionBalance={this.props.positivePredicionBalance}
            negativePredicionBalance={this.props.negativePredicionBalance}
            isOwned={isOwned}
            predictionState={this.props.predictionState}
            predictionStateStr={this.props.predictionStateStr}
            daysLeft={daysLeft}
            outcome={this.props.outcome}
            />

          {/* FINISH */}
          {isOwned && this.props.predictionState >= 2 && now >= this.props.withdrawEndDate &&
            <FinishComponent
              balance={this.props.balance}
              finishPrediction={this.props.finishPrediction}
              />
          }

          {/* WITHDRAW */}
          {this.props.predictionState === 2 && now < this.props.withdrawEndDate &&
            <WithdrawComponent
              estimatePrize={this.props.estimatePrize}
              withdrawPrize={this.props.withdrawPrize}
              />
          }

          {/* RESOLVE */}
          {isOwned && this.props.predictionState === 1 &&
            <ResolveComponent
              resolveMarket={this.props.resolveMarket}
              />
          }

          {/* WAIT */}
          {!isOwned && this.props.predictionState === 1 &&
            <WaitComponent/>
          }

          {/* BET */}
          {this.props.predictionState === 0 &&
            <PlaceBetComponent
              isOwned={isOwned}
              placeBet={this.props.placeBet}
              />
          }

          {/* HISTORY */}
          {this.props.predictionState === 0 &&
          <HistoryComponent
            playerPositiveBalance={this.props.playerPositiveBalance}
            playerNegativeBalance={this.props.playerNegativeBalance}
          />
          }

          {/* COMMENTS */}
          {/*<CommentsComponent/>*/}

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
    web3: state.network.web3,
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
