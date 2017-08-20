import { connectPrediction } from '.';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {resetPrediction} from "./ResetPredictionAction";

export function placeBet(bet, betEther) {
  console.log('placeBet()', bet, betEther);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const prediction = getState().prediction.contract;
    console.log('prediction', prediction);

    dispatch(setWaiting(true));

    // Place bet
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', bet, betWei, getState().network.activeAccountAddress);
    prediction.bet(bet, {
      from: getState().network.activeAccountAddress,
      value: betWei,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('bet placed!');
      dispatch(resetPrediction());
      dispatch(connectPrediction(prediction.address));
      dispatch(forgetPreview(prediction.address));
      dispatch(setWaiting(false));
    });
  };
}
