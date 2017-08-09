/*eslint no-undef: "off"*/
const Market = artifacts.require('./Market.sol');
import * as util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';

contract('Market (Resolve)', function(accounts) {

  it('should be resolvable only by the owner, and only after the closing date', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 5);
    let state = 0;

    await expectThrow(contract.resolve(true, {from: accounts[1]}));
    state = await contract.getState();
    assert.equal(state, 0, 'game was resolved by a regular player');

    await expectThrow(contract.resolve(true, {from: accounts[0]}));
    state = await contract.getState();
    assert.equal(state, 0, 'game was resolved by the owner before the closing date');

    // Advance blocks.
    // skipBlocks assumes its running on testrpc.
    // console.log('blockNum (before): ', web3.eth.blockNumber);
    util.skipBlocks(5, web3);
    // console.log('blockNum (after): ', web3.eth.blockNumber);

    state = await contract.getState();
    assert.equal(state, 1, 'state was supposed to be Closed (1)');

    await contract.resolve(true, {from: accounts[0]});
    state = await contract.getState();
    assert.equal(state, 2, 'owner did not change state to Resolved(2)');
  });

});
