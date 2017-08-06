import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../build/contracts/Market.json';

export const LOAD_MARKET = 'market/LOAD_MARKET';

export function loadMarket(market) {
  console.log('loadMarket() - market.address', market.address);
  return {
    type: LOAD_MARKET,
    payload: market
  };
}

export function fetchMarketAsync(address) {
  console.log('fetchMarketAsync() - address: ', address);
  return function(dispatch, getState) {
    const web3 = getState().web3.instance;
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    Market.at(address)
      .then((market) => {

        market.statement.call()
          .then(statement => {
            market.statement = statement;
            dispatch(loadMarket(market));
          });
      });
  };
}
