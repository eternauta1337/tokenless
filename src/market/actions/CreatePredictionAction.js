import { push } from 'react-router-redux';
import * as dateUtil from '../../utils/DateUtil';

export function createPrediction(statement, betEndDate, withdrawEndDate) {
  console.log('createPrediction()', statement, betEndDate, withdrawEndDate);
  return async function(dispatch, getState) {

    const market = getState().market.contract;
    const acct = getState().network.activeAccountAddress;
    console.log('acct:', acct);

    // Listen for bet event...
    market.PredictionCreatedEvent().watch((error, result) => {
      console.log('PredictionCreatedEvent');
      if(error) {
        console.log('prediction creation error');
      }
      else {
        const predictionAddress = result.args.predictionAddress;
        console.log('prediction created at:', predictionAddress);
        dispatch(push(`/prediction/${predictionAddress}`));
        market.PredictionCreatedEvent().stopWatching();
      }
    });

    const unixBet = dateUtil.dateToUnix(betEndDate);
    const unixWith = dateUtil.dateToUnix(withdrawEndDate);
    console.log('creating prediction:', statement, unixBet, unixWith);
    await market.createPrediction(
      statement,
      unixBet,
      unixWith,
      {
        from: acct,
        gas: 1500000
      }
    );
  };
}
