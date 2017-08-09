
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

export { placeBetAsync } from './PlaceBet';
export { resolveMarketASync } from './ResolveMarket';
export { retrieveAndWatchMarketAt } from './WatchMarket';
export { withdrawPrizeAsync } from './WithdrawPrize';
