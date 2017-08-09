import Web3 from 'web3';
import * as util from '../utils/Web3Util';

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

export function loadWeb3Async(debugMode) {
  return function(dispatch, getState) {
    window.addEventListener('load', function() {
      let web3 = window.web3;
      if(debugMode) {
        console.log('<<< WEB3 DEBUG MODE ON >>>');
        window.util = util;
      }
      if(typeof web3 !== 'undefined') { // Use injected web3
        web3 = new Web3(web3.currentProvider);
        dispatch(initWeb3(web3));
      }
      else { // Use testrpc
        const provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(provider);
        dispatch(initWeb3(web3));
      }
    });
  };
}
