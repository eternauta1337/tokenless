import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import InfoComponent from '../components/InfoComponent';
import PlaceBetComponent from '../components/PlaceBetComponent';
import ResolveComponent from '../components/ResolveComponent';
import WithdrawComponent from '../components/WithdrawComponent';
import FinishComponent from '../components/FinishComponent';
import WaitComponent from '../components/WaitComponent';
import UserInfoComponent from '../components/UserInfoComponent';
import CommentsComponent from '../components/CommentsComponent';
import Giphy from '../../common/components/RandomGifsComponent';
import '../../styles/index.css';
import {
  resetMarket,
  connectPrediction,
  placeBet,
  resolveMarket,
  withdrawPrize,
  withdrawFees,
} from '../actions';
import {EXPLORER_URL, TARGET_LIVE_NETWORK} from "../../constants";

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

    {/* PROCESSING... */}
    if(this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent title="Processing transaction..."/>
          <Giphy firstInput={'computers'} />
        </div>
      );
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

          {/* WITHDRAW PRIZE */}
          {!isOwned &&
            this.props.predictionState === 2 &&
            this.props.estimatePrize > 0 &&
            <WithdrawComponent
              claimAmount={this.props.estimatePrize}
              claimMethod={this.props.withdrawPrize}
              />
          }

          {/* WITHDRAW FEES */}
          { isOwned &&
            this.props.predictionState === 2 &&
            this.props.bcTimestamp > this.props.withdrawEndDate &&
            <WithdrawComponent
              claimAmount={this.props.balance}
              claimMethod={this.props.withdrawFees}
            />
          }

          {/* RESOLVE */}
          {isOwned && this.props.predictionState === 1 &&
            <ResolveComponent
              resolveMarket={this.props.resolveMarket}
              />
          }

          {/* PLAYER WAIT */}
          {!isOwned && this.props.predictionState === 1 &&
            <WaitComponent
              isOwned={false}
            />
          }

          {/* OWNER WAIT */}
          {isOwned &&
           this.props.predictionState === 2 &&
           this.props.bcTimestamp < this.props.withdrawEndDate &&
            <WaitComponent
              isOwned={true}
            />
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
            bcTimestamp={this.props.bcTimestamp}
            predictionState={this.props.predictionState}
            playerPrizes={this.props.estimatePrize}
            playerPositiveBalance={this.props.playerPositiveBalance}
            playerNegativeBalance={this.props.playerNegativeBalance}
          />

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

          {/* COMMENTS */}
          <br/>
          <br/>
          <CommentsComponent/>

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
    ...state.prediction,
    isWaiting: state.network.isWaiting
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectPrediction: (address) => dispatch(connectPrediction(address)),
    placeBet: (prediction, value) => dispatch(placeBet(prediction, value)),
    resolveMarket: (outcome) => dispatch(resolveMarket(outcome)),
    withdrawPrize: () => dispatch(withdrawPrize()),
    withdrawFees: () => dispatch(withdrawFees()),
    resetMarket: () => dispatch(resetMarket())
  };
};

const PredictionComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Prediction);

export default PredictionComponent;
