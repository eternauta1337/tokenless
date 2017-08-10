import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Market.json';

export const CONNECT_MARKET = 'market/CONNECT';

export function connectMarket(address) {
  console.log('connectMarket', address);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;

    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const market = await Market.at(address);

    dispatch({
      type: CONNECT_MARKET,
      payload: market
    });
  };
}
