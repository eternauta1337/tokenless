import { connectPrediction } from '.';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {resetPrediction} from "./ResetPredictionAction";

export function withdrawPrize() {
  console.log('withdrawPrize()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;
    // console.log('prediction:', prediction);

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing prize...', getState().network.activeAccountAddress);
    prediction.withdrawPrize({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('withdraw prize succesful!');
      dispatch(resetPrediction());
      dispatch(connectPrediction(prediction.address));
      dispatch(setWaiting(false));
    });
  };
}
