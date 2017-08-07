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
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;

    // Retrieve market.
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const market = await Market.at(address);

    // Prepopulate some of the market's data.
    market.statement = await market.statement.call();
    market.blocksRemaining = await getMarketBlocksRemaining(web3, market);
    console.log('rem', market.blocksRemaining);

    dispatch(loadMarket(market));
  };
}

// ---------------------
// Utils
// ---------------------

async function getMarketBlocksRemaining(web3, market) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber(async (err, blockNumber) => {
      const endBlock = (await market.endBlock.call()).toNumber();
      const remaining = endBlock - blockNumber;
      console.log(endBlock, blockNumber, remaining);
      resolve(remaining);
    });
  });
}
