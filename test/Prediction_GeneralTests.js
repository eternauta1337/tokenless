/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from '../src/utils/Web3Util';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (General)', function(accounts) {

  before(() => {
    console.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should contain a valid text statement', async function() {

    const betEndTimestamp = util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5);
    const withdrawEndTimestamp = util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10);
    // console.log('betEndTimestamp:', betEndTimestamp);
    // console.log('withdrawEndTimestamp:', withdrawEndTimestamp);
    const contract = await Prediction.new(
      "Bitcoin will reach $5000 in October 1.",
      betEndTimestamp,
      withdrawEndTimestamp,
      2
    );
    // console.log('contract created');

    const statement = await contract.statement.call();
    // console.log('statement: ', statement);

    assert.notEqual(statement.length, 0, 'text is invalid');
  });

  it('should have a valid bet and withdraw end dates', async function() {

    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10),
      2
    );

    // Assumes that tests are ran immediately after contract creation.
    const betEndTimestamp = (await contract.betEndTimestamp.call()).toNumber();
    const withdrawEndTimestamp = (await contract.withdrawEndTimestamp.call()).toNumber();
    const nowTimestamp = util.currentSimulatedDateUnix;
    // console.log('betEndTimestamp: ', betEndTimestamp);
    // console.log('withdrawEndTimestamp: ', withdrawEndTimestamp);

    assert.isAbove(betEndTimestamp, nowTimestamp, 'bet end date is invalid');
    assert.isAbove(withdrawEndTimestamp, betEndTimestamp, 'withdraw end date is invalid');
  });

  it('it should correctly track its state', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10),
      2
    );
    // console.log('contract created');

    // Initial state should be 0 'OPEN'.
    let state = 0;
    state = (await contract.getState()).toNumber();
    // console.log('time: ', await util.getTimestamp(web3));
    // console.log('state:', state);
    assert.equal(state, 0, 'incorrect state');

    // Make a bet.
    // console.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    // Skip until bets are closed.
    // console.log('skipping betting period');
    await util.skipTime(dateUtil.daysToSeconds(6), web3);
    // console.log('time: ', await util.getTimestamp(web3));

    // State should be 1 'CLOSED'.
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 1, 'incorrect state');

    // Resolve the prediction.
    // console.log('resolving...');
    await contract.resolve(true, {from: accounts[0]});

    // State should be 2 'RESOLVED'.
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 2, 'incorrect state');

    // Skip until withdrawals end.
    // console.log('skipping withdrawal period');
    await util.skipTime(dateUtil.daysToSeconds(6), web3);

    // Withdraw all funds.
    // console.log('withdrawing funds');
    await contract.withdrawFees({from: accounts[0]});

    // State should be 3 'FINISHED'.
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(state, 3, 'incorrect state');
  });

});
