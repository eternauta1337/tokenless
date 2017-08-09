import * as util from './MarketActionUtils';

export function withdrawPrizeAsync() {
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().markets.focusedMarket;

    // Listen for withdraw event...
    market.ClaimEvent().watch(async (error, result) => {
      console.log('ClaimEvent', error, result);
      if(error) {
        // TODO: dispatch error...
        console.log('error withdrawing funds');
      }
      else {
        console.log('withdraw succesful!', result);

        // Claim != withdrawal, still need to
        // pull the ether out.
        await market.withdrawPayments({
          from: web3.eth.coinbase
        });

        util.refreshMarketData(market, dispatch, getState);
      }
    });

    // TODO: dispatch resolve action...

    // Withdraw
    console.log('withdrawing prize...');
    await market.claimPrize({
      from: web3.eth.coinbase
    });
  };
}
