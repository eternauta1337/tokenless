import React from 'react';

// import BetComponent from './BetComponent';
// import MarketResolve from './MarketResolveComponent';
// import MarketInfo from './MarketInfoComponent';
// import MarketWithdraw from './MarketWithdrawComponent';
// import MarketDestroy from './MarketDestroyComponent';
import ConnectComponent from '../common/ConnectComponent';
import '../../styles/index.css';

class Market extends React.Component {

  componentWillReceiveProps() {

    const {
      isNetworkConnected,
      isMarketConnected,
      connectMarket,
      routeParams
    } = this.props;

    if(isNetworkConnected && !isMarketConnected) {
      const address = routeParams.address;
      connectMarket(address);
    }
  }

  render() {

    const {
      activeAccount,
      isConnected
    } = this.props;

    return (
      <div>
        Active account: {activeAccount}
        {!isConnected && <ConnectComponent/>}
        {this.renderContract()}
      </div>
    );
  }

  renderContract() {
    // const {
    //   market,
    //   isConnected,
    //   coinbase,
    //   nonce
    // } = this.props;
    // if(isConnected) {
    //   return (
    //     <div>
    //       <h1>{market.meta.statement}</h1>
    //       <div className='hidden'>Nonce: {nonce}</div>
    //       <div>Player address: {coinbase}</div>
    //       <MarketInfo market={market}/>
    //       <br/>
    //       {this.renderBetElements()}
    //       <br/>
    //       {this.renderWithdrawElements()}
    //       <br/>
    //       {this.renderOwnerElements()}
    //     </div>
    //   );
    // }
  }

  // renderWithdrawElements() {
  //   const {
  //     market,
  //     withdrawPrizeAsync
  //   } = this.props;
  //   if(
  //     market.meta.state === 2 &&
  //     market.meta.outcome === market.meta.playerPrediction
  //   ) {
  //     return (
  //       <div>
  //         <MarketWithdraw
  //           market={market}
  //           withdrawPrizeAsync={withdrawPrizeAsync}
  //           />
  //       </div>
  //     );
  //   }
  // }

  // renderBetElements() {
  //   const {
  //     market,
  //     placeBetAsync
  //   } = this.props;
  //   return (
  //     <div>
  //       <MarketBet
  //         market={market}
  //         placeBetAsync={placeBetAsync}
  //         />
  //     </div>
  //   );
  // }

  // renderOwnerElements() {
  //   const {
  //     market,
  //     resolveMarketASync,
  //     destroyMarketAsync
  //   } = this.props;
  //   if(market.meta.isOwnedByUser) {
  //     return (
  //       <div>
  //         <h2>You own this market.</h2>
  //         {market.meta.blocksRemaining <= 0 &&
  //           market.meta.state < 2 &&
  //           <MarketResolve
  //             resolveMarketASync={resolveMarketASync}
  //             />
  //         }
  //         {market.meta.blocksRemaining < -5 &&
  //           market.meta.state >= 2 &&
  //           <MarketDestroy
  //             destroyMarketAsync={destroyMarketAsync}
  //             />
  //         }
  //       </div>
  //     );
  //   }
  // }

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
