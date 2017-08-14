import { connectMarket } from '.';
import { forgetPreview } from '../../factory/actions/ForgetMarketPreviewAction';

export function withdrawPrize() {
  return async function(dispatch, getState) {

    const market = getState().market.contract;

    // Listen for withdraw event...
    market.ClaimEvent().watch(async (error, result) => {
      console.log('ClaimEvent', error, result);
      if(error) {
        console.log('error withdrawing funds');
      }
      else {
        console.log('withdraw succesful!', result);

        // Claim != withdrawal, still need to
        // pull the ether out.
        await market.withdrawPayments({
          from: getState().network.activeAccountAddress
        });

        dispatch(forgetPreview(market.address));
        dispatch(connectMarket(market.address));
      }
    });

    // Withdraw
    console.log('withdrawing prize...');
    await market.claimPrize({
      from: getState().network.activeAccountAddress
    });
  };
}
