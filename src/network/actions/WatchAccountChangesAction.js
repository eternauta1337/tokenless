import {
  SET_ACTIVE_ACCOUNT_INDEX
} from "./SetActiveAccountAction";

export function watchAccountChanges(index) {
  console.log('setActiveAccountIndex()', index);
  return function(dispatch, getState) {

    const web3 = getState().network.web3;
    const activeAcct = getState().network.activeAccountAddress;

    const accountInterval = setInterval(function() {
      console.log('watch account...');
      if (web3.eth.accounts[0] !== activeAcct) {
        dispatch({
          type: SET_ACTIVE_ACCOUNT_INDEX,
          payload: 0
        });
      }
    }, 500);
  };
}
