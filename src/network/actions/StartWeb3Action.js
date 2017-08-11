import Web3 from 'web3';
import * as web3Util from '../../utils/Web3Util';
import { setActiveAccountIndex } from './SetActiveAccountAction';
import { connectFactory } from '../../factory/actions/ConnectFactoryAction';

export const START_WEB3 = 'network/START_WEB3';
export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

export function startWeb3() {
  console.log('startWeb3()');
  return function(dispatch, getState) {
    // window.addEventListener('load', () => {

      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      const web3 = new Web3(provider);

      // TODO: use injected web3 if available for
      // metamask support.

      // Report web3 connected.
      dispatch({
        type: START_WEB3,
        payload: web3
      });

      // Retrieve the main market factory.
      dispatch(connectFactory());

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
    // });
  };
}
