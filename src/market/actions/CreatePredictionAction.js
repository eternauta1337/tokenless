import { push } from 'react-router-redux';

export function createPrediction(statement, duration) {
  console.log('createPrediction()', statement, duration);
  return async function(dispatch, getState) {

    const market = getState().market.contract;

    console.log('creating prediction:', statement, duration);
    const creationTransaction = await market.createPrediction(
      statement,
      duration, {
        from: getState().network.activeAccountAddress,
        gas: 2000000
      }
    );

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    if(predictionAddress) {
      console.log('prediction created at:', predictionAddress);
      dispatch(push(`/prediction/${predictionAddress}`));
    }
    else {
      // TODO: handle error
    }
  };
}
