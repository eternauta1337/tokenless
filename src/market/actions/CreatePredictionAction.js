import { push } from 'react-router-redux';
import * as dateUtil from '../../utils/DateUtil';
import {TARGET_LIVE_NETWORK} from "../../constants";

export function createPrediction(statement, betEndDate, withdrawEndDate) {
  console.log('createPrediction()', statement, betEndDate, withdrawEndDate);
  return async function(dispatch, getState) {

    const market = getState().market.contract;
    const acct = getState().network.activeAccountAddress;
    const web3 = getState().network.web3;
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
      }
      market.PredictionCreatedEvent().stopWatching();
    });

    // Send transaction.
    const unixBet = dateUtil.dateToUnix(betEndDate);
    const unixWith = dateUtil.dateToUnix(withdrawEndDate);
    console.log('creating prediction:', statement, unixBet, unixWith);
    await market.createPrediction(
      statement,
      unixBet,
      unixWith,
      {
        from: acct,
        gas: TARGET_LIVE_NETWORK === 'testrpc' ? 4000000 : undefined
      }
    );
  };
}
