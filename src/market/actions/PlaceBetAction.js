import { connectMarket } from '.';
import { forgetPreview } from '../../factory/actions/ForgetMarketPreviewAction';

export function placeBet(prediction, betEther) {
  console.log('placeBet()', prediction, betEther);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const market = getState().market.contract;

    // Listen for bet event...
    market.BetEvent().watch((error, result) => {
      console.log('BetEvent', error, result);
      if(error) {
        console.log('placing bet failed');
      }
      else {
        console.log('bet placed!');
        dispatch(connectMarket(market.address));
        dispatch(forgetPreview(market.address));
      }
    });

    // Place bet
    const betWei = web3.toWei(betEther, 'ether');
    console.log('placing bet: ', prediction, betWei, getState().network.activeAccountAddress);
    await market.bet(prediction, {
      from: getState().network.activeAccountAddress,
      value: betWei
    });
  };
}
