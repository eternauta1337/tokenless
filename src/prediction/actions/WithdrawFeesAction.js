import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';
import {TARGET_LIVE_NETWORK} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function withdrawFees() {
  console.log('withdrawFees()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;

    prediction.WithdrawFeesEvent().watch(async (error, result) => {
      console.log('WithdrawFeesEvent');
      if(error) {
        console.log('error withdrawing fees');
      }
      else {
        console.log('withdraw fees succesful!');
        dispatch(connectPrediction(prediction.address));
        dispatch(forgetPreview(prediction.address));
      }
      prediction.WithdrawFeesEvent().stopWatching();
      dispatch(setWaiting(false));
    });

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing fees...', getState().network.activeAccountAddress);
    prediction.withdrawFees({
      from: getState().network.activeAccountAddress,
      gas: TARGET_LIVE_NETWORK === 'testrpc' ? 4000000 : undefined
    }).catch(() => {
      dispatch(setWaiting(false));
    });
  };
}
