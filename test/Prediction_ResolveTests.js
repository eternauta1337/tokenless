/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Resolve)', function(accounts) {

  before(() => {
    console.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should be resolvable only by the owner, and only after the closing date', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10),
      2
    );
    let state = 0;
    // console.log('time: ', await util.getTimestamp(web3));

    // Try to resolve the game by a regular player, too early.
    // console.log('early resolve 1...');
    await expectThrow(contract.resolve(true, {from: accounts[1]}));
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 0, 'game was resolved by a regular player');

    // Try to resolve by the owner, too early.
    // console.log('early resolve 2...');
    await expectThrow(contract.resolve(true, {from: accounts[0]}));
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 0, 'game was resolved by the owner before the closing date');

    // Make a bet.
    // console.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    // Skip betting phase.
    // console.log('skipping bet phase');
    await util.skipTime(dateUtil.daysToSeconds(6), web3);
    // console.log('time: ', await util.getTimestamp(web3));
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 1, 'state was supposed to be Closed (1)');

    // Resolve in the correct moment, by the owner.
    // console.log('proper resolve');
    await contract.resolve(true, {from: accounts[0]});
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 2, 'owner did not change state to Resolved(2)');
  });

});
