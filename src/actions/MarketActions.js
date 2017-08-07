import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../build/contracts/Market.json';

export const LOAD_MARKET = 'market/LOAD_MARKET';

// ---------------------
// Sync actions
// ---------------------

export function loadMarket(market) {
  return {
    type: LOAD_MARKET,
    payload: market
  };
}

// ---------------------
// Async actions
// ---------------------

export function fetchMarketAsync(address) {
  return function(dispatch, getState) {
    const web3 = getState().network.web3;
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
