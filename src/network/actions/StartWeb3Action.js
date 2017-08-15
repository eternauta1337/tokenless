import Web3 from 'web3';
import * as web3Util from '../../utils/Web3Util';
import { setActiveAccountIndex } from './SetActiveAccountAction';
import { connectMarket } from '../../market/actions/ConnectMarketAction';
import {
  USE_INJECTED_WEB3
} from '../../constants';
import {
  watchAccountChanges
} from '.';

export const START_WEB3 = 'network/START_WEB3';
export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

export function startWeb3() {
  console.log('startWeb3()');
  return function(dispatch, getState) {
    window.addEventListener('load', () => {

      let web3;
      if(USE_INJECTED_WEB3) {
        web3 = window.web3;
      }
      else {
        const provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(provider);
      }

      // Report web3 connected.
      dispatch({
        type: START_WEB3,
        payload: web3
      });

      // Fetch prediction contract.
      dispatch(connectMarket());

      // Watch blockchain parameters...
      setInterval(async () => {
        const blockchain = {};
        blockchain.blockNumber = await web3Util.getBlockNumber(web3);
        // console.log('update blockchain', blockchain.blockNumber);
        dispatch({
          type: UPDATE_NETWORK,
          payload: blockchain
        });
      }, 5000);

      dispatch(setActiveAccountIndex(0));

      if(USE_INJECTED_WEB3) {
        dispatch(watchAccountChanges());
      }
    });
  };
}
