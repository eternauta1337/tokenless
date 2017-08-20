import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {resetPrediction} from "./ResetPredictionAction";

export function withdrawFees() {
  console.log('withdrawFees()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing fees...', getState().network.activeAccountAddress);
    prediction.withdrawFees({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      dispatch(setWaiting(false));
      console.log('withdraw fees succesful!');
      dispatch(resetPrediction());
      dispatch(connectPrediction(prediction.address));
      dispatch(forgetPreview(prediction.address));
    });
  };
}
