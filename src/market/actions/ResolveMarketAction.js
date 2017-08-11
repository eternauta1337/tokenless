import { connectMarket } from '.';

export function resolveMarket(outcome) {
  return async function(dispatch, getState) {

    const market = getState().market.contract;

    // Listen for resolve event...
    market.ResolveEvent().watch((error, result) => {
      console.log('ResolveEvent', error, result);
      if(error) {
        console.log('error resolving contract');
      }
      else {
        console.log('contract resolved!', result);
        dispatch(connectMarket(market.address));
      }
    });

    // Resolve
    console.log('resolving market with outcome:', outcome);
    await market.resolve(outcome, {
      from: getState().network.activeAccountAddress
    });
  };
}
