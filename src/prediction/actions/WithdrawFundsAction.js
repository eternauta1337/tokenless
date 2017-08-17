import { forgetPreview } from '../../market/actions/ForgetPredictionPreviewAction';

export function withdrawFunds() {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    console.log('withdrawing funds...');
    await prediction.withdrawPayments({
      from: getState().network.activeAccountAddress
    });

    console.log('withdraw succesful?');
    dispatch(forgetPreview());
  };
}
