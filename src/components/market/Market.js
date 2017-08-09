import React from 'react';

import MarketBet from './MarketBet';
import MarketResolve from './MarketResolve';
import MarketInfo from './MarketInfo';
import MarketWithdraw from './MarketWithdraw';

class Market extends React.Component {

  render() {
    console.log('Market RENDER');
    return (
      <div>
        {this.renderConnecting()}
        {this.renderContract()}
      </div>
    );
  }

  renderContract() {
    const {
      market,
      isConnected,
      nonce
    } = this.props;
    if(isConnected) {
      return (
        <div>
          <h1>{market.meta.statement}</h1>
          Nonce: {nonce}
          <MarketInfo market={market}/>
          {this.renderBetElements()}
          {this.renderOwnerElements()}
          {this.renderWithdrawElements()}
        </div>
      );
    }
  }

  renderWithdrawElements() {
    const {
      market,
      withdrawPrizeAsync
    } = this.props;
    if(market.meta.state === 2) {
      return (
        <div>
          <MarketWithdraw
            market={market}
            withdrawPrizeAsync={withdrawPrizeAsync}
            />
        </div>
      );
    }
  }

  renderBetElements() {
    const {
      market,
      placeBetAsync
    } = this.props;
    if(market.meta.blocksRemaining > 0) {
      return (
        <div>
          <MarketBet
            market={market}
            placeBetAsync={placeBetAsync}
            />
        </div>
      );
    }
  }

  renderOwnerElements() {
    const {
      market,
      resolveMarketASync
    } = this.props;
    if(market.meta.isOwnedByUser) {
      return (
        <div>
          <h2>You own this market.</h2>
          {market.meta.blocksRemaining <= 0 &&
            market.meta.state !== 2 &&
            <MarketResolve
              resolveMarketASync={resolveMarketASync}
              />
          }
        </div>
      );
    }
  }

  renderConnecting() {
    const { isConnected } = this.props;
    if(!isConnected) {
      return (
        <div>Connecting...</div>
      );
    }
  }
}

export default Market;
