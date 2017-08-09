import * as util from './MarketActionUtils';

export function resolveMarketASync(outcome) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // Listen for resolve event...
    market.ResolveEvent().watch((error, result) => {
      console.log('ResolveEvent', error, result);
      if(error) {
        // TODO: dispatch error resolving...
        console.log('error resolving contract');
      }
      else {
        console.log('contract resolved!', result);
        util.refreshMarketData(market, dispatch, getState);
      }
    });

    // TODO: dispatch resolve action...

    // Resolve
    console.log('resolving market with outcome:', outcome);
    await market.resolve(outcome, {
      from: web3.eth.coinbase
    });
  };
}
