import {
  SET_ACTIVE_ACCOUNT_INDEX
} from "./SetActiveAccountAction";

export function watchAccountChanges() {
  console.log('watchAccountChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;
    const activeAcct = getState().network.activeAccountAddress;

    let interval = setInterval(function() {
      if(!web3) return;
      const candidate = web3.eth.accounts[0];
      // console.log('check account:', candidate, activeAcct);
      if (candidate && candidate !== activeAcct) {
        console.log('<<< account changed >>>');
        clearInterval(interval);
        dispatch({
          type: SET_ACTIVE_ACCOUNT_INDEX,
          payload: 0
        });
        dispatch(watchAccountChanges());
      }
    }, 1000);
  };
}
