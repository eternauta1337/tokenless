import { connectPrediction } from '.';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function resolveMarket(outcome) {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    // Listen for resolve event...

    const event = prediction.ResolveEvent();
    event.watch((error, result) => {
      console.log('ResolveEvent', error, result);
      if(error) {
        console.log('error resolving contract');
      }
      else {
        console.log('contract resolved!', result);
        dispatch(connectPrediction(prediction.address));
      }
      event.stopWatching();
      dispatch(setWaiting(false));
    });

    dispatch(setWaiting(true));

    // Resolve
    console.log('resolving prediction with outcome:', outcome);
    prediction.resolve(outcome, {
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 === 'testrpc' ? 4000000 : undefined
    }).catch(() => {
      dispatch(setWaiting(false));
      event.stopWatching();
    });
  };
}
