import * as util from './MarketActionUtils';

export function resolveMarketASync(outcome) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch resolve action...

    console.log('resolving market with outcome:', outcome);
    const initState = (await market.getState()).toNumber();
    console.log('init state: ', initState);

    // Check state to confirm if the contract resolved.
    await market.resolve(outcome, {
      from: web3.eth.coinbase
    });
    const newState = (await market.getState()).toNumber();
    console.log('new state: ', newState);

    if(newState === 2) {
      console.log('contract resolved!');
      util.refreshMarketData(market, dispatch, getState);
    }
    else {
      // TODO: dispatch error resolving...
      console.log('error resolving contract');
    }
  };
}
