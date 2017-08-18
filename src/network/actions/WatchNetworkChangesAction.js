export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

// import { connectNetwork } from "./connectNetworkAction";
import * as web3Util from '../../utils/Web3Util';

export function watchNetworkChanges() {
  console.log('watchNetworkChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;

    // Watch transactions.
    // web3.eth.filter('pending').watch(function(error, result){
    //   console.log('pending transaction (filter):', result);
    // });

    // Query the network with an interval.
    setInterval(async () => {

      const blockchain = {};
      blockchain.blockNumber = await web3Util.getBlockNumber(web3);
      blockchain.currentTime = await web3Util.getTimestamp(web3);
      blockchain.networkId = await web3Util.getNetworkId(web3);
      if(blockchain.networkId) {
        if(blockchain.networkId === '1') blockchain.networkName = 'mainnet';
        else if(blockchain.networkId === '2') blockchain.networkName = 'morden';
        else if(blockchain.networkId === '3') blockchain.networkName = 'ropsten';
        else if(blockchain.networkId === '4') blockchain.networkName = 'rinkeby';
        else if(blockchain.networkId === '42') blockchain.networkName = 'kovan';
        else blockchain.networkName = 'testrpc';
      }
      // console.log('blockchain', blockchain);

      dispatch({
        type: UPDATE_NETWORK,
        payload: blockchain
      });

      // if(!getState().web3) {
      //   dispatch(connectNetwork());
      // }
    }, 5000);
  };
}
