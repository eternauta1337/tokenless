import Web3 from 'web3';
import { setActiveAccountIndex } from './SetActiveAccountAction';

export const START_WEB3 = 'network/START_WEB3';

export function startWeb3() {
  return function(dispatch, getState) {
    window.addEventListener('load', () => {

      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      const web3 = new Web3(provider);

      // TODO: use injected web3 if available for
      // metamask support.

      dispatch({
        type: START_WEB3,
        payload: web3
      });

      dispatch(setActiveAccountIndex(0));
    });
  };
}
