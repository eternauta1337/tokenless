import { connectPrediction } from '.';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {forgetPreview} from "../../market/actions/ForgetPredictionPreviewAction";

export function resolveMarket(outcome) {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    dispatch(setWaiting(true));

    // Resolve
    console.log('resolving prediction with outcome:', outcome);
    prediction.resolve(outcome, {
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('contract resolved!');
      dispatch(connectPrediction(prediction.address));
      dispatch(setWaiting(false));
      dispatch(forgetPreview(prediction.address));
    });
  };
}
