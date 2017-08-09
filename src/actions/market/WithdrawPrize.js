import * as util from './MarketActionUtils';

export function withdrawPrizeAsync() {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch resolve action...
    console.log('withdrawing prize...');
    const initPlayerBalance = web3.fromWei((await market.getPlayerBalance({from: web3.coinbase})).toNumber(), 'ether');
    console.log('init balance:', initPlayerBalance);

    // Check balance to confirm withdrawal.
    await market.claimPrize({
      from: web3.eth.coinbase
    });
    const newPlayerBalance = web3.fromWei((await market.getPlayerBalance({from: web3.coinbase})).toNumber(), 'ether');
    console.log('new balance:', newPlayerBalance);

    if(newPlayerBalance === 0) {
      console.log('withdraw succesful!');
      util.refreshMarketData(market, dispatch, getState);
    }
    else {
      // TODO: dispatch error...
      console.log('error withdrawing funds');
    }
  };
}
