import { connectPrediction } from '.';

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
      }
    });

    // Claim
    console.log('withdraw fees...');
    await prediction.withdrawFees({
      from: getState().network.activeAccountAddress
    });
  };
}
