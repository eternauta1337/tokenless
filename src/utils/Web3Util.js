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
      method: 'evm_mine',
    });
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
