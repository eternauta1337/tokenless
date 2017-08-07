import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../build/contracts/Market.json';

export const LOAD_MARKET = 'market/LOAD_MARKET';

let watchMarketInterval;
let activeCoinbase;

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

export function retrieveAndWatchMarketAt(address) {
  return async function(dispatch, getState) {

    // Retrieve market.
    const web3 = getState().network.web3;
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const market = await Market.at(address);

    // Extract static info.
    market.statement = await market.statement.call();
    market.isOwnedByUser = await isOwnedByUser(web3, market);
    market.blocksRemaining = await getMarketBlocksRemaining(web3, market);
    dispatch(loadMarket(market));

    // Start interval to observe dynamic info.
    stopWatchingMarket();
    watchMarketInterval = setInterval(async () => {
      // console.log('watch market');
      if(!activeCoinbase || activeCoinbase !== web3.eth.coinbase) {
        console.log('coinbase changed');
        activeCoinbase = web3.eth.coinbase;
        market.isOwnedByUser = await isOwnedByUser(web3, market);
        dispatch(loadMarket({...market}));
      }
    }, 1000);
  };
}

export function stopWatchingMarket() {
  if(watchMarketInterval) {
    clearInterval(watchMarketInterval);
    watchMarketInterval = undefined;
  }
}

// ---------------------
// Utils
// ---------------------

async function isOwnedByUser(web3, market) {
  return new Promise(async (resolve) => {
    const owner = await market.owner.call();
    resolve(web3.eth.coinbase === owner);
  });
}

async function getMarketBlocksRemaining(web3, market) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber(async (err, blockNumber) => {
      const endBlock = (await market.endBlock.call()).toNumber();
      const remaining = endBlock - blockNumber;
      resolve(remaining);
    });
  });
}
