export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

// import { connectWeb3 } from "./ConnectWeb3Action";
import * as web3Util from '../../utils/Web3Util';

export function watchNetworkChanges() {
  console.log('watchNetworkChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;

    setInterval(async () => {

      const blockchain = {};
      blockchain.blockNumber = await web3Util.getBlockNumber(web3);
      blockchain.currentTime = await web3Util.getTimestamp(web3);
      // console.log('blockchain', blockchain);

      dispatch({
        type: UPDATE_NETWORK,
        payload: blockchain
      });

      // if(!getState().web3) {
      //   dispatch(connectWeb3());
      // }
    }, 5000);
  };
}
