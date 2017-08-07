import Web3 from 'web3';

export const INIT_WEB3 = 'network/INIT_WEB3';

// ---------------------
// Sync actions
// ---------------------

export function initWeb3(web3) {
  return {
    type: INIT_WEB3,
    payload: web3
  };
}

// ---------------------
// Async actions
// ---------------------

export function loadWeb3Async() {
  return function(dispatch, getState) {
    window.addEventListener('load', function() {
      // Use injected web3.
      var web3 = window.web3;
      if(typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        dispatch(initWeb3(web3));
      }
      else {
        // Use testrpc.
        const provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(provider);
        dispatch(initWeb3(web3));
      }
    });
  };
}
