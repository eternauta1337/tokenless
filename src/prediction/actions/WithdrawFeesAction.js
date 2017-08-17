import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';

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
    });

    // Claim
    console.log('withdrawing fees...', getState().network.activeAccountAddress);
    await prediction.withdrawFees({
      from: getState().network.activeAccountAddress,
      gas: 50000
    });
  };
}
