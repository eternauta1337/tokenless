import { connectPrediction } from '.';

export function claimPrize() {
  console.log('claimPrize()');
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    prediction.ClaimPrizeEvent().watch(async (error, result) => {
      console.log('ClaimPrizeEvent', error, result);
      if(error) {
        console.log('error claiming prize');
      }
      else {
        console.log('claim prize succesful!', result);
        dispatch(connectPrediction(prediction.address));
      }
    });

    // Claim
    console.log('claiming prize...');
    await prediction.claimPrize({
      from: getState().network.activeAccountAddress
    });
  };
}
