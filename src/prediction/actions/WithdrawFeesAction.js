import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function withdrawFees() {
  console.log('withdrawFees()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;

    const event = prediction.WithdrawFeesEvent();
    event.watch(async (error, result) => {
      console.log('WithdrawFeesEvent');
      if(error) {
        console.log('error withdrawing fees');
      }
      else {
        console.log('withdraw fees succesful!');
        dispatch(connectPrediction(prediction.address));
        dispatch(forgetPreview(prediction.address));
      }
      event.stopWatching();
      dispatch(setWaiting(false));
    });

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing fees...', getState().network.activeAccountAddress);
    prediction.withdrawFees({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      event.stopWatching();
      dispatch(setWaiting(false));
    });
  };
}
