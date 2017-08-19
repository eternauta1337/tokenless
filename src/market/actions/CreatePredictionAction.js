import { push } from 'react-router-redux';
import * as dateUtil from '../../utils/DateUtil';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function createPrediction(statement, betEndDate, withdrawEndDate) {
  console.log('createPrediction()', statement, betEndDate, withdrawEndDate);
  return async function(dispatch, getState) {

    const market = getState().market.contract;
    const acct = getState().network.activeAccountAddress;
    console.log('acct:', acct);

    dispatch(setWaiting(true));

    // Send transaction.
    const unixBet = dateUtil.dateToUnix(betEndDate);
    const unixWith = dateUtil.dateToUnix(withdrawEndDate);
    console.log('creating prediction:', statement, unixBet, unixWith);
    market.createPrediction(
      statement,
      unixBet,
      unixWith,
      {
        from: acct,
        gas: USE_INJECTED_WEB3 ? undefined : 4000000
      }
    ).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then((result) => {
      console.log('prediction created');
      const predictionAddress = result.logs[0].args.predictionAddress;
      dispatch(push(`/prediction/${predictionAddress}`));
      dispatch(setWaiting(false));
    });
  };
}
