import Web3 from 'web3';
import { setActiveAccountIndex } from './SetActiveAccountAction';
import { connectMarket } from '../../market/actions/ConnectMarketAction';
import { USE_INJECTED_WEB3 } from '../../constants';
import {
  watchAccountChanges,
  watchBlockchainChanges
} from '.';

export const START_WEB3 = 'network/START_WEB3';

export function startWeb3() {
  console.log('startWeb3()');
  return function(dispatch) {

    let web3;
    if(USE_INJECTED_WEB3) {
      console.log('using injected web3 instance');
      web3 = window.web3;
    }
    else {
      console.log('using own web3 instance');
      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
    }

    dispatch({
      type: START_WEB3,
      payload: web3
    });

    dispatch(connectMarket());
    dispatch(watchBlockchainChanges());
    dispatch(setActiveAccountIndex(0));

    if(USE_INJECTED_WEB3) {
      dispatch(watchAccountChanges());
    }
  };
}
