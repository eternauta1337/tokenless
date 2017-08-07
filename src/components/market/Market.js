import React from 'react';
import MarketBet from './MarketBet';
import MarketResolve from './MarketResolve';
import MarketInfo from './MarketInfo';

// TODO: remove
/*
  Test addresses:
  0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a
*/

class Market extends React.Component {

  render() {
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
      placeBetAsync 
    } = this.props;
    if(isConnected) {
      return (
        <div>
          <h1>{market.meta.statement}</h1>
          <MarketInfo market={market}/>
          <MarketBet
            market={market}
            placeBetAsync={placeBetAsync}
            />
          {this.renderOwnerElements()}
        </div>
      );
    }
  }

  renderOwnerElements() {
    const { market } = this.props;
    if(market.meta.isOwnedByUser) {
      return (
        <div>
          <h2>You own this market.</h2>
          {market.meta.blocksRemaining <= 0 &&
            <MarketResolve/>
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
