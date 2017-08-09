import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../build/contracts/Market.json';
import * as util from '../utils/Web3Util';

export const LOAD_MARKET = 'market/LOAD_MARKET';

let watchMarketInterval;

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

export function resolveMarketASync(outcome) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch resolve action...

    console.log('resolving market with outcome:', outcome);
    const initState = (await market.getState()).toNumber();
    console.log('state: ', initState);

    // Check state to confirm if the contract resolved.
    await market.resolve(outcome, {
      from: web3.eth.coinbase
    });
    const newState = (await market.getState()).toNumber();

    if(newState === 2) {
      console.log('contract resolved!');
      refreshMarketData(market, dispatch, getState);
    }
    else {
      // TODO: dispatch error resolving...
      console.log('error resolving contract');
    }
  };
}

export function placeBetAsync(prediction, betEther) {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // TODO: dispatch placing bet action...

    // Check balance to confirm if the bet is succesful later.
    const playerAddress = web3.eth.coinbase;
    const initPlayerBalance = await market.getPlayerBalance({from: playerAddress});
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, playerAddress);
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
  console.log('retrieveAndWatchMarketAt', address);
  return async function(dispatch, getState) {

    // Retrieve market.
    const web3 = getState().network.web3;
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const market = await Market.at(address);

    // Start interval to observe dynamic info.
    stopWatchingMarket();
    refreshBlockchainData(web3);
    refreshMarketData(market, dispatch, getState);
    watchMarketInterval = setInterval(async () => {
      console.log('watch market');

      let needsUpdate = false;

      const blockNumber = web3.meta.blockNumber;
      const coinbase = web3.meta.coinbase;
      await refreshBlockchainData(web3);

      // Block changed?
      // console.log('  blockNumber: ', web3.meta.blockNumber);
      if(blockNumber !== web3.meta.blockNumber) {
        // console.log('block number changed');
        needsUpdate = true;
      }

      // Coinbase changed?
      // console.log('  coinbase: ', web3.meta.coinbase);
      if(coinbase !== web3.meta.coinbase) {
        // console.log('coinbase changed');
        needsUpdate = true;
      }

      if(needsUpdate) {
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

async function refreshBlockchainData(web3) {
  return new Promise(async (resolve) => {
    web3.meta = {};
    web3.meta.coinbase = web3.eth.coinbase;
    web3.meta.blockNumber = await util.getBlockNumber(web3);
    resolve();
  });
}

async function refreshMarketData(market, dispatch, getState) {
  const web3 = getState().network.web3;
  market.meta = {};
  market.meta.state = (await market.getState()).toNumber();
  market.meta.statement = await market.statement.call();
  market.meta.isOwnedByUser = await isOwnedByUser(web3, market);
  market.meta.blocksRemaining = await getMarketBlocksRemaining(web3, market);
  market.meta.playerBalance = web3.fromWei((await market.getPlayerBalance({from: web3.coinbase})).toNumber(), 'ether');
  market.meta.playerPrediction = await market.getPlayerPrediction({from: web3.coinbase});
  market.meta.positivePredicionBalance = web3.fromWei((await market.getPredictionBalance(true)).toNumber());
  market.meta.negativePredicionBalance = web3.fromWei((await market.getPredictionBalance(false)).toNumber());
  console.log('refresh market: ', market.meta);
  dispatch(loadMarket(market));
}

async function isOwnedByUser(web3, market) {
  return new Promise(async (resolve) => {
    const owner = await market.owner.call();
    resolve(web3.eth.coinbase === owner);
  });
}

async function getMarketBlocksRemaining(web3, market) {
  return new Promise(async (resolve) => {
    const blockNumber = await util.getBlockNumber(web3);
    const endBlock = (await market.endBlock.call()).toNumber();
    const remaining = endBlock - blockNumber;
    resolve(remaining);
  });
}
