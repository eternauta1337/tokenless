import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Market.json';
import * as util from './MarketActionUtils';

let watchMarketInterval;

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
    util.refreshBlockchainData(web3);
    util.refreshMarketData(market, dispatch, getState);
    watchMarketInterval = setInterval(async () => {
      console.log('watch market');

      let needsUpdate = false;

      const blockNumber = web3.meta.blockNumber;
      const coinbase = web3.meta.coinbase;
      await util.refreshBlockchainData(web3);

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
        util.refreshMarketData(market, dispatch, getState);
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
