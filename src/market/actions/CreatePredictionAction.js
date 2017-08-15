import { push } from 'react-router-redux';
import * as dateUtil from '../../utils/DateUtil';

export function createPrediction(statement, betEndDate, withdrawEndDate) {
  console.log('createPrediction()', statement, betEndDate, withdrawEndDate);
  return async function(dispatch, getState) {

    const market = getState().market.contract;
    const acct = getState().network.activeAccountAddress;
    console.log('acct:', acct);

    // console.log('creating prediction:', statement, betEndDate, withdrawEndDate);
    const creationTransaction = await market.createPrediction(
      statement,
      dateUtil.dateToUnix(betEndDate),
      dateUtil.dateToUnix(withdrawEndDate),
      function(error, res) {
        console.log('metamask callback:', error, res);
      },
      {
        from: acct,
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
      console.log('prediction creation failed');
      // TODO: handle error
    }
  };
}
