/*eslint no-undef: "off"*/

let colors = require('colors');

export function log(...msg) {
  console.log(colors.gray('       ', ...msg));
}

export function getBalanceInEther(address) {
  return +web3.fromWei(+web3.eth.getBalance(address), 'ether');
}

export function skipBlocks(numBlocks) {
  for(let i = 0; i < numBlocks; i++) {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
    });
  }
}
