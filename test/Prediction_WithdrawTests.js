/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Withdraw)', function(accounts) {

  before(() => {
    util.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should allow winners to withdraw their prize after the prediction is resolved', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Place a few bets.
    util.log('placing bets...');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[3],
      value: web3.toWei(1, 'ether')
    });

    // Skip betting phase.
    util.log('skipping bets...');
    await web3Util.skipTime(dateUtil.daysToSeconds(5), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    util.log('resolving...');
    await contract.resolve(true, {from: accounts[0]});

    util.log('losers try to withdraw');
    await expectThrow(contract.withdrawPrize({from: accounts[2]}));
    await expectThrow(contract.withdrawPrize({from: accounts[3]}));

    // Winner try to withdraw.
    util.log('winner try to withdraw');
    const initPlayerBalance = await web3Util.getBalanceInEther(accounts[1], web3);
    util.log('initPlayerBalance', initPlayerBalance);
    const prize = web3.fromWei(await contract.calculatePrize(true, {from: accounts[1]}), 'ether').toNumber();
    util.log('expected prize:', prize);
    assert.notEqual(0, prize, 'prize should not be zero');
    await contract.withdrawPrize({from: accounts[1]});
    const newPlayerBalance = await web3Util.getBalanceInEther(accounts[1], web3);
    util.log('newPlayerBalance', newPlayerBalance);
    const expectedNewPlayerBalance = initPlayerBalance + prize;
    util.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newPlayerBalance, expectedNewPlayerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    util.log('winner try to withdraw again');
    await expectThrow(contract.withdrawPrize({from: accounts[1]}));
  });

  it('should allow the owner to withdraw his fees after the prediction is resolved', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('contract created');

    // Place bets.
    util.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });

    // Skip until bets are closed.
    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(6), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Resolve the prediction.
    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    // Withdraw prizes.
    util.log('withdrawing prizes');
    const prize = web3.fromWei(await contract.calculatePrize(false, {from: accounts[2]}), 'ether').toNumber();
    util.log('expected prize:', prize);
    assert.notEqual(0, prize, 'prize should not be zero');
    await contract.withdrawPrize({from: accounts[2]});

    const initOwnerBalance = await web3Util.getBalanceInEther(accounts[0], web3);

    // Withdraw all fees.
    util.log('withdrawing fees');
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('expected fees:', fees);
    assert.notEqual(0, fees, 'fees should not be zero');
    await contract.withdrawFees({from: accounts[0]});

    const newOwnerBalance = await web3Util.getBalanceInEther(accounts[0], web3);
    const expectedNewOwnerBalance = initOwnerBalance + fees;
    util.log('expectedNewOwnerBalance', expectedNewOwnerBalance);
    assert.approximately(newOwnerBalance, expectedNewOwnerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    util.log('winner try to withdraw again');
    await expectThrow(contract.withdrawFees({from: accounts[0]}));
  });

  it('it should allow fee and prize withdrawals both in resolved and finished states');
  it('it should allow an owner to purge the contract after the withdraw period expires');
});
