import { push } from 'react-router-redux';
import { forgetMarket } from '../../factory/actions/ForgetMarketAction';
import { resetMarket } from './ResetMarketAction';
import { forgetPreview } from '../../factory/actions/ForgetMarketPreviewAction';

export function destroyMarket() {
  return async function(dispatch, getState) {

    const market = getState().market.contract;

    // Listen for destroy event...
    market.DestroyEvent().watch((error, result) => {
      console.log('DestroyEvent', error, result);
      if(error) {
        console.log('destroy market failed');
      }
      else {
        console.log('market destroyed!');

        dispatch(forgetPreview(market.address));

        // Resets the focused market state.
        dispatch(resetMarket());

        // Removes the market from the factory.
        dispatch(forgetMarket(market.address));

        // Navigate to home.
        dispatch(push('/'));
      }
    });

    // Destroy
    console.log('destroying market...');
    await market.destroy({
      from: getState().network.activeAccountAddress
    });

    const owner = await market.owner.call();
    console.log('owner', owner);
  };
}
