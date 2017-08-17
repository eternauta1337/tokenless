import { connectPrediction } from '.';

export function resolveMarket(outcome) {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    // Listen for resolve event...
    prediction.ResolveEvent().watch((error, result) => {
      console.log('ResolveEvent', error, result);
      if(error) {
        console.log('error resolving contract');
      }
      else {
        console.log('contract resolved!', result);
        dispatch(connectPrediction(prediction.address));
      }
    });

    // Resolve
    console.log('resolving prediction with outcome:', outcome);
    await prediction.resolve(outcome, {
      from: getState().network.activeAccountAddress,
      gas: 50000
    });
  };
}
