import { connectPrediction } from '.';
import {TARGET_LIVE_NETWORK} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

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
      prediction.ResolveEvent().stopWatching();
      dispatch(setWaiting(false));
    });

    dispatch(setWaiting(true));

    // Resolve
    console.log('resolving prediction with outcome:', outcome);
    await prediction.resolve(outcome, {
      from: getState().network.activeAccountAddress,
      gas: TARGET_LIVE_NETWORK === 'testrpc' ? 4000000 : undefined
    });
  };
}
