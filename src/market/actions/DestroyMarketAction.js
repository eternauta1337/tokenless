import { push } from 'react-router-redux';

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
