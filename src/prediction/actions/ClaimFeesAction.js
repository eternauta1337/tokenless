import { connectPrediction } from '.';

export function claimFees() {
  console.log('claimFees()');
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    prediction.ClaimFeesEvent().watch(async (error, result) => {
      console.log('ClaimFeesEvent', error, result);
      if(error) {
        console.log('error claiming fees');
      }
      else {
        console.log('claim fees succesful!', result);
        dispatch(connectPrediction(prediction.address));
      }
    });

    // Claim
    console.log('claiming fees...');
    await prediction.claimFees({
      from: getState().network.activeAccountAddress
    });
  };
}
