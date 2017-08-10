import * as EthUtil from 'ethereumjs-util';

export async function getBlockNumber(web3) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber(async (err, blockNumber) => {
      resolve(blockNumber);
    });
  });
}

export function getBalanceInEther(address, web3) {
  return +web3.fromWei(+web3.eth.getBalance(address), 'ether');
}

export function skipBlocks(numBlocks, web3) {
  for(let i = 0; i < numBlocks; i++) {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine'
    });
    // web3.currentProvider.send({jsonrpc: '2.0',method: 'evm_mine'});
  }
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
  var privateKeyBytes = hexToBytes(privateKeyHex);
  var addressBytes =  EthUtil.privateToAddress(privateKeyBytes);
  return '0x' + addressBytes.toString('hex');
};

export function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c+=2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};
