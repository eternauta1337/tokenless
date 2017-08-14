import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';

export function placeBet(prediction, betEther) {
  console.log('placeBet()', prediction, betEther);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const prediction = getState().prediction.contract;

    // Listen for bet event...
    prediction.BetEvent().watch((error, result) => {
      console.log('BetEvent', error, result);
      if(error) {
        console.log('placing bet failed');
      }
      else {
        console.log('bet placed!');
        dispatch(connectPrediction(prediction.address));
        dispatch(forgetPreview(prediction.address));
      }
    });

    // Place bet
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, getState().network.activeAccountAddress);
    await prediction.bet(prediction, {
      from: getState().network.activeAccountAddress,
      value: betWei
    });
  };
}
