import TruffleContract from 'truffle-contract';
import PredictionMarketArtifacts from '../../../build/contracts/PredictionMarket.json';
import { MARKET_ADDRESS } from '../../constants';

export const CONNECT_MARKET = 'prediction/CONNECT_MARKET';

export function connectFactory() {
  return async function(dispatch, getState) {
    console.log('connectFactory()');

    const market = {};
    const web3 = getState().network.web3;

    // Retrieve prediction.
    const Market = TruffleContract(PredictionMarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const contract = await Market.at(MARKET_ADDRESS);
    market.contract = contract;

    // Get prediction info.
    market.predictionAddresses = await contract.getPredictions();

    dispatch({
      type: CONNECT_MARKET,
      payload: market
    });
  };
}
