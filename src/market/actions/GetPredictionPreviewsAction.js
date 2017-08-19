import TruffleContract from 'truffle-contract';
import PredictionArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';

export const GET_PREDICTION_PREVIEW = 'prediction/GET_PREDICTION_PREVIEW';

export function getPredictionPreview(address) {
  return async function(dispatch, getState) {
    console.log('getMarketPreview()', address);

    const preview = {};
    const web3 = getState().network.web3;

    // Skip if preview has already been obtained.
    if(getState().market.previews[address]) {
      console.log('preview already fetched');
      return;
    }

    // Retrieve prediction.
    const Prediction = TruffleContract(PredictionArtifacts);
    Prediction.setProvider(web3.currentProvider);
    const contract = await Prediction.at(address);

    // Dispatch a dummy preview to express that
    // the preview is being fetched.
    preview.address = address;
    preview.balance = 0;
    preview.isFetching = true;
    // console.log('prediction: ', prediction);
    dispatch({
      type: GET_PREDICTION_PREVIEW,
      payload: preview
    });

    // Dispatch populated preview.
    preview.balance = await web3util.getBalanceInEther(address, web3);
    preview.statement = await contract.statement.call();
    preview.predictionState = (await contract.getState()).toNumber();
    preview.predictionStateStr = stateUtil.predictionStateToStr(preview.predictionState);
    preview.isFetching = false;
    // console.log('prediction: ', prediction);
    dispatch({
      type: GET_PREDICTION_PREVIEW,
      payload: preview
    });
  };
}
