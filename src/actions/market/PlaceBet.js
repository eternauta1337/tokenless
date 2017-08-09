import * as util from './MarketActionUtils';

export function placeBetAsync(prediction, betEther) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // Listen for bet event...
    market.BetEvent().watch((error, result) => {
      console.log('BetEvent', error, result);
      if(error) {
        // TODO: dispatch error placing bet action...
        console.log('placing bet failed');
      }
      else {
        console.log('bet placed!', result);
        util.refreshMarketData(market, dispatch, getState);
      }
    });

    // TODO: dispatch placing bet action...

    // Place bet
    const playerAddress = web3.eth.coinbase;
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, playerAddress);
    await market.bet(prediction, {
      from: playerAddress,
      value: betWei
    });
  };
}
