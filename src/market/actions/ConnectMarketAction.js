import TruffleContract from 'truffle-contract';
import PredictionMarketArtifacts from '../../../build/contracts/PredictionMarket.json';
import {
  DEBUG_MODE,
  TARGET_LIVE_NETWORK,
  MARKET_ADDRESS_DEV,
  MARKET_ADDRESS_MAINNET,
  MARKET_ADDRESS_ROPSTEN
} from '../../constants';

export const CONNECT_MARKET = 'prediction/CONNECT_MARKET';

export function connectMarket() {
  return async function(dispatch, getState) {
    console.log('connectMarket()');

    const market = {};
    const web3 = getState().network.web3;

    // Retrieve prediction.
    const Market = TruffleContract(PredictionMarketArtifacts);
    Market.setProvider(web3.currentProvider);
    let targetAddr = '';
    if(TARGET_LIVE_NETWORK === 'testrpc') targetAddr = MARKET_ADDRESS_DEV;
    else if(TARGET_LIVE_NETWORK === 'mainnet') targetAddr = MARKET_ADDRESS_MAINNET;
    else if(TARGET_LIVE_NETWORK === 'ropsten') targetAddr = MARKET_ADDRESS_ROPSTEN;
    else { console.log('!!! UNKNOWN TARGET NETWORK !!!'); return; }
    const contract = await Market.at(targetAddr);
    market.contract = contract;

    // Get prediction info.
    market.minWithdrawEndTimestampDelta = ( await contract.minWithdrawEndTimestampDelta.call() ).toNumber();
    market.predictionAddresses = await contract.getPredictions();
    // console.log('market', market);

    dispatch({
      type: CONNECT_MARKET,
      payload: market
    });
  };
}
