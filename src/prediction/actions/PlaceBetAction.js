import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function placeBet(bet, betEther) {
  console.log('placeBet()', bet, betEther);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const prediction = getState().prediction.contract;

    // Listen for bet event...
    const event = prediction.BetEvent();
    event.watch((error) => {
      console.log('BetEvent');
      if(error) {
        console.log('placing bet failed', bet);
      }
      else {
        console.log('bet placed!', bet);
        dispatch(connectPrediction(prediction.address));
        dispatch(forgetPreview(prediction.address));
      }
      dispatch(setWaiting(false));
      event.stopWatching();
    });

    dispatch(setWaiting(true));

    // Place bet
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, getState().network.activeAccountAddress);
    prediction.bet(bet, {
      from: getState().network.activeAccountAddress,
      value: betWei,
      gas: USE_INJECTED_WEB3 === 'testrpc' ? 4000000 : undefined
    }).catch(() => {
      dispatch(setWaiting(false));
      event.stopWatching();
    });
  };
}
