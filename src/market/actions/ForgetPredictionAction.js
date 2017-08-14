export const PREDICTION_FORGOTTEN = 'prediction/PREDICTION_FORGOTTEN';

export function forgetMarket(address) {
  console.log('forgetMarket()', address);
  return async function(dispatch, getState) {

    const market = getState().factory.contract;

    console.log('forgetting prediction:', address);
    const transaction = await market.forgetMarket(
      address, {
        from: getState().network.activeAccountAddress
      }
    );

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const eventArgs = transaction.logs[0].args;
    const predictionAddress = eventArgs.predictionAddress;
    if(predictionAddress) {
      console.log('prediction forgotten at:', predictionAddress);
      dispatch({
        type: PREDICTION_FORGOTTEN,
        payload: predictionAddress
      });
    }
    else {
      // TODO: handle error
    }
  };
}
