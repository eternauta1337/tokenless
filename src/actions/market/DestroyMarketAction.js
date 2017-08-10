import * as util from './MarketActionUtils';

export function destroyMarketAsync() {
  return async function(dispatch, getState) {

    const market = getState().markets.focusedMarket;

    // Listen for destroy event...
    market.DestroyEvent().watch((error, result) => {
      console.log('DestroyEvent', error, result);
      if(error) {
        // TODO: dispatch error destroying...
        console.log('destroy market failed');
      }
      else {
        console.log('market destroyed!', result);
        util.refreshMarketData(market, dispatch, getState);
      }
    });

    // TODO: dispatch destroying action...

    // Destroy
    const playerAddress = getState().network.activeAccount;
    console.log('destroying market: ', playerAddress);
    await market.destroy({
      from: playerAddress
    });

    const owner = await market.owner.call();
    console.log('owner', owner);
  };
}
