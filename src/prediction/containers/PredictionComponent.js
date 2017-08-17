import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import InfoComponent from '../components/InfoComponent';
import PlaceBetComponent from '../components/PlaceBetComponent';
import ResolveComponent from '../components/ResolveComponent';
import ClaimComponent from '../components/ClaimComponent';
import FinishComponent from '../components/FinishComponent';
import WaitComponent from '../components/WaitComponent';
import UserInfoComponent from '../components/UserInfoComponent';
import WithdrawFundsComponent from '../components/WithdrawFundsComponent';
import CommentsComponent from '../components/CommentsComponent';
import * as dateUtil from '../../utils/DateUtil';
import * as web3Util from '../../utils/Web3Util';
import '../../styles/index.css';
import {
  resetMarket,
  connectPrediction,
  placeBet,
  resolveMarket,
  claimPrize,
  claimFees,
  withdrawFunds
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
    this.refreshMarket(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refreshMarket(nextProps);
  }

  refreshMarket(props) {
    if(props.isNetworkConnected) {
      const blockAdvanced = props.blockNumber !== undefined && (props.blockNumber > this.state.lastRecordedBlockNumber);
      const addressChanged = props.activeAccountAddress !== this.state.lastRecordedPlayerAddress;
      if(!props.isConnected || blockAdvanced || addressChanged) {
        if(props.blockNumber) this.setState({ lastRecordedBlockNumber: props.blockNumber });
        if(props.activeAccountAddress) this.setState({ lastRecordedPlayerAddress: props.activeAccountAddress });
        console.log('PredictionComponent requesting update... block advanced', blockAdvanced, 'addressChanged', addressChanged);
        props.connectPrediction(props.routeParams.address);
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
            betEndDate={this.props.betEndDate}
            withdrawalEndDate={this.props.withdrawEndDate}
            positivePredicionBalance={this.props.positivePredicionBalance}
            negativePredicionBalance={this.props.negativePredicionBalance}
            isOwned={isOwned}
            predictionState={this.props.predictionState}
            predictionStateStr={this.props.predictionStateStr}
            outcome={this.props.outcome}
            balance={this.props.balance}
            />

          {/* FINISH */}
          {this.props.predictionState >= 3 &&
            <FinishComponent/>
          }

          {/* CLAIM */}
          {this.props.predictionState === 2 &&
           this.props.payments === 0 &&
           this.props.estimatePrize > 0 &&
            <ClaimComponent
              claimValue={isOwned ? this.props.balance : this.props.estimatePrize}
              claimMethod={isOwned ? claimFees : claimPrize}
              />
          }

          {/* WITHDRAW FUNDS */}
          {this.props.predictionState === 2 && this.props.payments !== 0 &&
            <WithdrawFundsComponent
              payments={this.props.payments}
              withdrawFunds={this.props.withdrawFunds}
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

          {/* USER INFO */}
          <UserInfoComponent
            predictionState={this.props.predictionState}
            playerPayments={this.props.payments}
            playerPrizes={this.props.estimatePrize}
            playerPositiveBalance={this.props.playerPositiveBalance}
            playerNegativeBalance={this.props.playerNegativeBalance}
          />

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
    bcTimestamp: state.network.currentTime,
    ...state.prediction
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectPrediction: (address) => dispatch(connectPrediction(address)),
    placeBet: (prediction, value) => dispatch(placeBet(prediction, value)),
    resolveMarket: (outcome) => dispatch(resolveMarket(outcome)),
    claimPrize: () => dispatch(claimPrize()),
    claimFees: () => dispatch(claimFees()),
    resetMarket: () => dispatch(resetMarket()),
    withdrawFunds: () => dispatch(withdrawFunds()),
  };
};

const PredictionComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Prediction);

export default PredictionComponent;
