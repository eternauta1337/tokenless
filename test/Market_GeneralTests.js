/*eslint no-undef: "off"*/
const Market = artifacts.require('./Market.sol');
import * as util from '../src/utils/Web3Util';

contract('Market (General)', function(accounts) {

  it('should contain a valid text statement', async function() {
    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    const statement = await contract.statement.call();
    // console.log('statement: ', statement);

    assert.notEqual(statement.length, 0, 'text is invalid');
  });

  it('should have a valid end date', async function() {
    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    // Assumes that tests are ran immediately after contract creation.
    const lifeSpan = (await contract.endBlock.call()).toNumber() - web3.eth.blockNumber;
    // console.log('lifeSpan: ', lifeSpan);

    assert.isAbove(lifeSpan, 0, 'contract was just created but has no time left');
  });

  it.only('it should correctly track its state', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 5);
    let state = 0;

    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 0, 'incorrect state');

    util.skipBlocks(6, web3);

    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 1, 'incorrect state');

    await contract.resolve(true, {from: accounts[0]});

    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 2, 'incorrect state');
  });

});
