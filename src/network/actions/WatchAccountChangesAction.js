import {
  SET_ACTIVE_ACCOUNT_INDEX
} from "./SetActiveAccountAction";

export function watchAccountChanges() {
  console.log('watchAccountChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;
    const activeAcct = getState().network.activeAccountAddress;

    setInterval(function() {
      console.log('watch account...');
      if (web3.eth.accounts[0] !== activeAcct) {
        console.log('account changed');
        dispatch({
          type: SET_ACTIVE_ACCOUNT_INDEX,
          payload: 0
        });
      }
    }, 1000);
  };
}
