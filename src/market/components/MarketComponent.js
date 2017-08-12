import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import MarketInfoComponent from './MarketInfoComponent';
import '../../styles/index.css';
import {
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

    {/* CONNECTING... */}
    if(!this.props.isConnected) {
      return (
        <div>
          Attempting to connect with market:
          <ConnectComponent/>
        </div>
      );
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
        <h1 className="market-statement">
          "{this.props.statement}"
        </h1>

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
