import React from 'react';
import { connect } from 'react-redux';

import {
  connectMarket,
  placeBet,
  resolveMarket,
  withdrawPrize,
  destroyMarket
} from '../actions';

import ConnectComponent from '../../components/common/ConnectComponent';
import '../../styles/index.css';

class Market extends React.Component {

  constructor() {
    super();
    this.state = {
      lastRecordedBlockNumber: 0
    };
  }

  componentWillMount() {
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

  handleBetButtonClick(prediction) {
    console.log(this.betInputField.value);
    this.props.placeBet(prediction, this.betInputField.value);
  };

  handleResolveButtonClick(outcome) {
    this.props.resolveMarket(outcome);
  };

  handleWithdrawButtonClick() {
    this.props.withdrawPrize();
  };

  handleDestroyButtonClick() {
    this.props.destroyMarket();
  };

  setBetInputField(input) {
    this.betInputField = input;
  }

  render() {
    if(!this.props.isConnected) {
      return (
        <div>
          Attempting to connect with market:
          <ConnectComponent/>
        </div>
      );
    }

    const isOwned = this.props.activeAccountAddress === this.props.owner;
    const totalBalance = this.props.positivePredicionBalance + this.props.negativePredicionBalance;

    return (
      <div>

        <h1>{this.props.statement}</h1>

        {/* INFO */}
        <span>Market info:</span>
        <ul>
          <li>Total balance: {totalBalance} ETH</li>
          <li>Positive balance: {this.props.positivePredicionBalance} ETH</li>
          <li>Negative balance: {this.props.negativePredicionBalance} ETH</li>
          <li>Market state: {this.props.marketStateStr}</li>
          <li>outcome: {this.props.outcome ? 'yea' : 'nay'}</li>
          <li>endBlock: {this.props.endBlock}</li>
          <li>killBlock: {this.props.killBlock}</li>
          <li>current block number: {this.props.blockNumber}</li>
          {isOwned &&
            <li>You own this market.</li>
          }
        </ul>

        {/* BET */}
        {this.props.marketState === 0 &&
          <div>
            <br/>
            <label>Place your bet:</label>
            <br/>
            <input
              placeholder='Place your bet'
              value='1'
              ref={ref => this.setBetInputField(ref)}
              />
            <button onClick={(evt) => this.handleBetButtonClick(true)}>Yea</button>
            <button onClick={(evt) => this.handleBetButtonClick(false)}>Nay</button>
          </div>
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
    );
  }
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
    destroyMarket: () => dispatch(destroyMarket())
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
