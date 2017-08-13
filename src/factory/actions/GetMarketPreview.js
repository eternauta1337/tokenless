import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Market.json';

export const GET_MARKET_PREVIEW = 'factory/GET_MARKET_PREVIEW';

export function getMarketPreview(address) {
  return async function(dispatch, getState) {
    console.log('getMarketPreview()', address);

    const market = {};
    const web3 = getState().network.web3;

    // ---------------------
    // TODO: previews disabled because they make teh app
    // slow when there are a lot of markets
    // ---------------------

    // Retrieve market.
    // const Market = TruffleContract(MarketArtifacts);
    // Market.setProvider(web3.currentProvider);
    // const contract = await Market.at(address);
    // market.contract = contract;

    // Extract market info.
    market.address = address;
    // const positivePredicionBalance = +web3.fromWei((await contract.getPredictionBalance(true)).toNumber());
    // const negativePredicionBalance = +web3.fromWei((await contract.getPredictionBalance(false)).toNumber());
    // market.balance = positivePredicionBalance + negativePredicionBalance;
    // market.statement = await contract.statement.call();
    // console.log('market: ', market);
    market.balance = 0;
    market.statement = market.address;

    dispatch({
      type: GET_MARKET_PREVIEW,
      payload: market
    });
  };
}
