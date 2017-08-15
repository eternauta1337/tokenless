import * as EthUtil from 'ethereumjs-util';
import * as dateUtil from './DateUtil';

export let currentSimulatedDateUnix = dateUtil.dateToUnix(new Date());

export function getBlockNumber(web3) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber((err, blockNumber) => {
      resolve(blockNumber);
    });
  });
}

export function getBalanceInEther(address, web3) {
  return new Promise(resolve => {
    return +web3.eth.getBalance(address, function(error, result) {
      if(error) {
        console.log('error getting balance');
      }
      else {
        resolve( +web3.fromWei(result.toNumber(), 'ether'));
      }
    });
  });
}

export function skipBlocks(numBlocks, web3) {
  for(let i = 0; i < numBlocks; i++) {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine'
    });
  }
}

export function skipTime(seconds, web3) {
  web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [seconds],
    id: 0
  });
  skipBlocks(1, web3);
  currentSimulatedDateUnix += seconds; // keep track of when now is for concurent tests
  // Console snippet:
  // web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [1000], id: 0});
}

export function getTimestamp(web3) {
  return new Promise(async resolve => {
    const blockNumber = await getBlockNumber(web3);
    return web3.eth.getBlock(blockNumber, function(error, result) {
      if(error) {
        console.log('error getting timestamp');
      }
      else {
        resolve(result);
      }
    });
  });
  // Console snippet:
  // web3.eth.getBlock(web3.eth.blockNumber).timestamp;
}

export function sendDummyTransaction(web3) {
  web3.eth.sendTransaction({},
  (err, res) => {});
}

export async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function privateKeyToAddress(privateKeyHex) {
  const privateKeyBytes = hexToBytes(privateKeyHex);
  const addressBytes =  EthUtil.privateToAddress(privateKeyBytes);
  return '0x' + addressBytes.toString('hex');
};

export function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c+=2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};
