import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';

export function finishPrediction() {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    // Listen for destroy event...
    prediction.ClaimFeesEvent().watch(async (error, result) => {
      console.log('ClaimFeesEvent', error, result);
      if(error) {
        console.log('finish prediction failed');
      }
      else {
        console.log('prediction finished!');

        // Claim != withdrawal, still need to
        // pull the ether out.
        await prediction.withdrawPayments({
          from: getState().network.activeAccountAddress
        });

        // Forget listing.
        dispatch(forgetPreview(prediction.address));
      }
    });

    // Destroy
    console.log('finishing prediction...');
    await prediction.claimFees({
      from: getState().network.activeAccountAddress
    });
  };
}
