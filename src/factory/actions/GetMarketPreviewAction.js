import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Market.json';
import * as web3util from '../../utils/Web3Util';

export const GET_MARKET_PREVIEW = 'factory/GET_MARKET_PREVIEW';

export function getMarketPreview(address) {
  return async function(dispatch, getState) {
    console.log('getMarketPreview()', address);

    const preview = {};
    const web3 = getState().network.web3;

    // ---------------------
    // TODO: previews disabled because they make teh app
    // slow when there are a lot of markets
    // ---------------------

    // Skip if preview has already been obtained.
    if(getState().factory.previews[address]) {
      console.log('preview already fetched');
      return;
    }

    // Retrieve market.
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const contract = await Market.at(address);

    // Extract market info.
    preview.address = address;
    preview.balance = 0;
    preview.isFetching = true;
    // console.log('market: ', market);

    dispatch({
      type: GET_MARKET_PREVIEW,
      payload: preview
    });

    preview.balance = web3util.getBalanceInEther(address, web3);
    preview.statement = await contract.statement.call();
    preview.isFetching = false;

    dispatch({
      type: GET_MARKET_PREVIEW,
      payload: preview
    });
  };
}
