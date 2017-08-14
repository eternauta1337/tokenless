import { push } from 'react-router-redux';
import { forgetMarket } from '../../market/actions/ForgetPredictionAction';
import { resetMarket } from './ResetPredictionAction';
import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';

export function destroyMarket() {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    // Listen for destroy event...
    prediction.DestroyEvent().watch((error, result) => {
      console.log('DestroyEvent', error, result);
      if(error) {
        console.log('destroy prediction failed');
      }
      else {
        console.log('prediction destroyed!');

        dispatch(forgetPreview(prediction.address));

        // Resets the focused prediction state.
        dispatch(resetMarket());

        // Removes the prediction from the prediction.
        dispatch(forgetMarket(prediction.address));

        // Navigate to home.
        dispatch(push('/'));
      }
    });

    // Destroy
    console.log('destroying prediction...');
    await prediction.destroy({
      from: getState().network.activeAccountAddress
    });

    const owner = await prediction.owner.call();
    console.log('owner', owner);
  };
}
