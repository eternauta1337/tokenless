import { connectPrediction } from '.';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function withdrawPrize() {
  console.log('withdrawPrize()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;
    // console.log('prediction:', prediction);

    let event = prediction.WithdrawPrizeEvent();
    event.watch(async (error, result) => {
      console.log('WithdrawPrizeEvent', error, result);
      if(error) {
        console.log('error withdrawing prize');
      }
      else {
        console.log('withdraw prize succesful!', result);
        dispatch(connectPrediction(prediction.address));
      }
      event.stopWatching();
      dispatch(setWaiting(false));
    });

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing prize...', getState().network.activeAccountAddress);
    prediction.withdrawPrize({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 === 'testrpc' ? 4000000 : undefined
    }).catch(() => {
      dispatch(setWaiting(false));
      event.stopWatching();
    });
  };
}
