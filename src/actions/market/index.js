export { CONNECT_MARKET, connectMarket } from './ConnectMarketAction';

// import * as util from '../../utils/Web3Util';

// let watchMarketInterval;

// export function retrieveAndWatchMarketAt(address) {
//   console.log('retrieveAndWatchMarketAt', address);
//   return async function(dispatch, getState) {
//
//     // Retrieve market.
//     const web3 = getState().network.web3;
//     const Market = TruffleContract(MarketArtifacts);
//     Market.setProvider(web3.currentProvider);
//     const market = await Market.at(address);
//
//     util.refreshBlockchainData(web3);
//     util.refreshMarketData(market, dispatch, getState);
//
//     // Start interval to observe dynamic info.
//     // stopWatchingMarket();
//     // util.refreshBlockchainData(web3);
//     // util.refreshMarketData(market, dispatch, getState);
//     // watchMarketInterval = setInterval(async () => {
//     //   console.log('watch market');
//     //   util.refreshMarketData(market, dispatch, getState);
//     // }, 2000);
//   };
// };

// export function stopWatchingMarket() {
//   if(watchMarketInterval) {
//     clearInterval(watchMarketInterval);
//     watchMarketInterval = undefined;
//   }
// }

// export { placeBetAsync } from './PlaceBet';
// export { resolveMarketASync } from './ResolveMarket';
// export { withdrawPrizeAsync } from './WithdrawPrize';
// export { destroyMarketAsync } from './DestroyMarket';

// ---------------------
// Utils
// ---------------------

// export async function refreshBlockchainData(web3) {
//   return new Promise(async (resolve) => {
//     web3.meta = {};
//     // web3.meta.coinbase = web3.eth.coinbase ?  web3.eth.coinbase : web3.eth.accounts[0];
//     web3.meta.coinbase = web3.eth.accounts[0];
//     web3.meta.blockNumber = await util.getBlockNumber(web3);
//     resolve();
//   });
// }

// export async function refreshMarketData(market, dispatch, getState) {
//   const web3 = getState().network.web3;
//   market.meta = {};
//   market.meta.state = (await market.getState()).toNumber();
//   market.meta.statement = await market.statement.call();
//   market.meta.isOwnedByUser = await isOwnedByUser(web3, market);
//   market.meta.blocksRemaining = await getMarketBlocksRemaining(web3, market);
//   market.meta.playerBalance = web3.fromWei((await market.getPlayerBalance({from: web3.coinbase})).toNumber(), 'ether');
//   market.meta.playerPrediction = await market.getPlayerPrediction({from: web3.coinbase});
//   market.meta.positivePredicionBalance = web3.fromWei((await market.getPredictionBalance(true)).toNumber());
//   market.meta.negativePredicionBalance = web3.fromWei((await market.getPredictionBalance(false)).toNumber());
//   market.meta.outcome = await market.outcome.call();
//   console.log('refresh market: ', market.meta);
//   dispatch(loadMarket(market));
// }

// export async function isOwnedByUser(web3, market) {
//   return new Promise(async (resolve) => {
//     const owner = await market.owner.call();
//     resolve(web3.meta.coinbase === owner);
//   });
// }

// export async function getMarketBlocksRemaining(web3, market) {
//   return new Promise(async (resolve) => {
//     const blockNumber = await util.getBlockNumber(web3);
//     const endBlock = (await market.endBlock.call()).toNumber();
//     const remaining = endBlock - blockNumber;
//     resolve(remaining);
//   });
// }
