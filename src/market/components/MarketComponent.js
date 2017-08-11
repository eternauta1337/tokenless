import React from 'react';
import { connect } from 'react-redux';

import {
  connectMarket,
  placeBet,
  resolveMarket
} from '../actions';

import ConnectComponent from '../../components/common/ConnectComponent';
import '../../styles/index.css';

class Market extends React.Component {

  componentWillReceiveProps(nextProps) {

    const {
      isNetworkConnected,
      isConnected,
      connectMarket,
      routeParams
    } = nextProps;

    // Fetch market?
    if(isNetworkConnected && !isConnected) {
      connectMarket(routeParams.address);
    }
  }

  handleBetButtonClick(prediction) {
    console.log(this.betInputField.value);
    this.props.placeBet(prediction, this.betInputField.value);
  };

  handleResolveButtonClick(outcome) {
    this.props.resolveMarket(outcome);
  };

  setBetInputField(input) {
    this.betInputField = input;
  }

  render() {

    if(!this.props.isConnected) {
      return <ConnectComponent/>;
    }

    const isOwned = this.props.activeAccountAddress === this.props.owner;
    const totalBalance = this.props.positivePredicionBalance + this.props.negativePredicionBalance;

    return (
      <div>
        <h1>{this.props.statement}</h1>
        <span>Market info:</span>
        <ul>
          <li>Total balance: {totalBalance} ETH</li>
          <li>Positive balance: {this.props.positivePredicionBalance} ETH</li>
          <li>Negative balance: {this.props.negativePredicionBalance} ETH</li>
          <li>Market state: {this.props.marketStateStr}</li>
          <li>endBlock: {this.props.endBlock}</li>
          <li>killBlock: {this.props.killBlock}</li>
          <li>current block number: {this.props.blockNumber}</li>
          {this.props.marketState === 0 &&
            <li>Blocks until bets close: {this.props.blocksUntilBetsClose}</li>
          }
          {isOwned &&
            <li>You own this market.</li>
          }
        </ul>
        {this.props.marketState === 0 &&
          <div>
            <br/>
            <input
              placeholder='Place your bet'
              ref={ref => this.setBetInputField(ref)}
              ></input>
            <button onClick={(evt) => this.handleBetButtonClick(true)}>Yea</button>
            <button onClick={(evt) => this.handleBetButtonClick(false)}>Nay</button>
          </div>
        }
        {isOwned && this.props.marketState === 1 &&
          <div>
            <h2>Resolve this market now:</h2>
            <button onClick={(evt) => this.handleResolveButtonClick(true)}>Yea</button>
            <button onClick={(evt) => this.handleResolveButtonClick(false)}>Nay</button>
          </div>
        }
      </div>
    );
  }

  renderBetElements() {
    // const {
    //   market,
    //   placeBetAsync
    // } = this.props;
    // return (
    //   <div>
    //     <MarketBet
    //       market={market}
    //       placeBetAsync={placeBetAsync}
    //       />
    //   </div>
    // );
  }

  renderOwnerElements() {
    // const {
    //   market,
    //   resolveMarketASync,
    //   destroyMarketAsync
    // } = this.props;
    // if(market.meta.isOwnedByUser) {
    //   return (
    //     <div>
    //       <h2>You own this market.</h2>
    //       {market.meta.blocksRemaining <= 0 &&
    //         market.meta.state < 2 &&
    //         <MarketResolve
    //           resolveMarketASync={resolveMarketASync}
    //           />
    //       }
    //       {market.meta.blocksRemaining < -5 &&
    //         market.meta.state >= 2 &&
    //         <MarketDestroy
    //           destroyMarketAsync={destroyMarketAsync}
    //           />
    //       }
    //     </div>
    //   );
    // }
  }

  renderWithdrawElements() {
    // const {
    //   market,
    //   withdrawPrizeAsync
    // } = this.props;
    // if(
    //   market.meta.state === 2 &&
    //   market.meta.outcome === market.meta.playerPrediction
    // ) {
    //   return (
    //     <div>
    //       <MarketWithdraw
    //         market={market}
    //         withdrawPrizeAsync={withdrawPrizeAsync}
    //         />
    //     </div>
    //   );
    // }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('MarketContainer - state', state);
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
    resolveMarket: (outcome) => dispatch(resolveMarket(outcome))
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
