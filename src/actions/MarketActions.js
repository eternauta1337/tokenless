import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../build/contracts/Market.json';

export const LOAD_MARKET = 'market/LOAD_MARKET';
export const PLACE_BET = 'market/PLACE_BET';

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

export function placeBetAsync(prediction, betEther) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch placing bet action...
    console.log('placing bet...');

    // Check balance to confirm if the bet is succesful later.
    const playerAddress = web3.eth.coinbase;
    const initPlayerBalance = await market.getPlayerBalance({from: playerAddress});
    const betWei = web3.toWei(1, 'ether');
    await market.bet(prediction, {
      from: playerAddress,
      value: betWei
    });
    const newPlayerBalance = await market.getPlayerBalance({from: playerAddress});
    if(newPlayerBalance === initPlayerBalance) {
      // TODO: dispatch error placing bet action...
      console.log('placing bet failed');
    }
    else {
      console.log('bet placed!');
      refreshMarketData(market, dispatch, getState);
    }
  };
}

export function retrieveAndWatchMarketAt(address) {
  return async function(dispatch, getState) {

    // Retrieve market.
    const web3 = getState().network.web3;
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const market = await Market.at(address);

    // Start interval to observe dynamic info.
    stopWatchingMarket();
    refreshMarketData(market, dispatch, getState);
    watchMarketInterval = setInterval(async () => {
      // console.log('watch market');

      // Coinbase changed?
      if(!activeCoinbase || activeCoinbase !== web3.eth.coinbase) {
        console.log('coinbase changed');
        activeCoinbase = web3.eth.coinbase;
        refreshMarketData(market, dispatch, getState);
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

async function refreshMarketData(market, dispatch, getState) {
  const web3 = getState().network.web3;
  market.meta = {};
  market.meta.statement = await market.statement.call();
  market.meta.isOwnedByUser = await isOwnedByUser(web3, market);
  market.meta.blocksRemaining = await getMarketBlocksRemaining(web3, market);
  market.meta.playerBalance = (await market.getPlayerBalance({from: web3.coinbase})).toNumber();
  market.meta.playerPrediction = await market.getPlayerPrediction({from: web3.coinbase});
  console.log('refresh market: ', market.meta);
  dispatch(loadMarket({...market}));
}

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
