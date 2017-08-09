import * as util from './MarketActionUtils';

export function placeBetAsync(prediction, betEther) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch placing bet action...

    // Check balance to confirm if the bet is succesful later.
    const playerAddress = web3.eth.coinbase;
    const initPlayerBalance = await market.getPlayerBalance({from: playerAddress});
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, playerAddress);
    await market.bet(prediction, {
      from: playerAddress,
      value: betWei
    });
    const newPlayerBalance = await market.getPlayerBalance({from: playerAddress});
    if(newPlayerBalance === initPlayerBalance) {
      // TODO: dispatch error placing bet action...
      console.log('placing bet failed');
    }
    else {
      console.log('bet placed!');
      util.refreshMarketData(market, dispatch, getState);
    }
  };
}
