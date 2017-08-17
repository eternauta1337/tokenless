import { connectPrediction } from '.';
import {TARGET_LIVE_NETWORK} from "../../constants";

export function withdrawPrize() {
  console.log('withdrawPrize()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;
    // console.log('prediction:', prediction);

    prediction.WithdrawPrizeEvent().watch(async (error, result) => {
      console.log('WithdrawPrizeEvent', error, result);
      if(error) {
        console.log('error withdrawing prize');
      }
      else {
        console.log('withdraw prize succesful!', result);
        dispatch(connectPrediction(prediction.address));
      }
      prediction.WithdrawPrizeEvent().stopWatching();
    });

    // Claim
    console.log('withdrawing prize...', getState().network.activeAccountAddress);
    await prediction.withdrawPrize({
      from: getState().network.activeAccountAddress,
      gas: TARGET_LIVE_NETWORK === 'testrpc' ? 4000000 : undefined
    });
  };
}
