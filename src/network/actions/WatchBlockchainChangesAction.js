export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

import * as web3Util from '../../utils/Web3Util';

export function watchBlockchainChanges() {
  console.log('watchBlockchainChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;

    setInterval(async () => {
      const blockchain = {};
      blockchain.blockNumber = await web3Util.getBlockNumber(web3);
      console.log('update blockchain', blockchain.blockNumber);
      dispatch({
        type: UPDATE_NETWORK,
        payload: blockchain
      });
    }, 5000);
  };
}
