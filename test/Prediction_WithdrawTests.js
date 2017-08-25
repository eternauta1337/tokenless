/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Withdraw)', function(accounts) {

  before(() => {
    console.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should allow winners to withdraw their prize', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    // console.log('time: ', await util.getTimestamp(web3));

    // Place a few bets.
    // console.log('placing bets...');
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
    // console.log('skipping bets...');
    await util.skipTime(dateUtil.daysToSeconds(5), web3);
    // console.log('time: ', await util.getTimestamp(web3));

    // Resolve.
    // console.log('resolving...');
    await contract.resolve(true, {from: accounts[0]});

    // Loser try to withdraw.
    // console.log('losers try to withdraw');
    await expectThrow(contract.withdrawPrize({from: accounts[2]}));
    await expectThrow(contract.withdrawPrize({from: accounts[3]}));

    // Winner try to withdraw.
    // console.log('winner try to withdraw');
    const initPlayerBalance = await util.getBalanceInEther(accounts[1], web3);
    // console.log('initPlayerBalance', initPlayerBalance);
    await contract.withdrawPrize({from: accounts[1]});
    const newPlayerBalance = await util.getBalanceInEther(accounts[1], web3);
    // console.log('newPlayerBalance', newPlayerBalance);
    const prize = 1 + 2 * 0.98;
    const expectedNewPlayerBalance = initPlayerBalance + prize;
    // console.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newPlayerBalance, expectedNewPlayerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    // console.log('winner try to withdraw again');
    await expectThrow(contract.withdrawPrize({from: accounts[1]}));
  });

  it.only('should allow the owner to withdraw his fees right after resolution', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    console.log('contract created');

    // Place bets.
    console.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });

    // Skip until bets are closed.
    console.log('skipping betting period');
    await util.skipTime(dateUtil.daysToSeconds(6), web3);
    console.log('time: ', await util.getTimestamp(web3));

    // Resolve the prediction.
    console.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    console.log('resolution timestamp: ', resolutionTime);

    // Withdraw prizes.
    console.log('withdrawing prizes');
    const prize = web3.fromWei(await contract.calculatePrize(false, {from: accounts[2]}), 'ether').toNumber();
    console.log('expected prize:', prize);
    await contract.withdrawPrize({from: accounts[2]});

    const initOwnerBalance = await util.getBalanceInEther(accounts[0], web3);

    // Withdraw all fees.
    console.log('withdrawing fees');
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    console.log('expected fees:', fees);
    await contract.withdrawFees({from: accounts[0]});

    const newOwnerBalance = await util.getBalanceInEther(accounts[0], web3);
    const expectedNewOwnerBalance = initOwnerBalance + fees;
    // console.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newOwnerBalance, expectedNewOwnerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    // console.log('winner try to withdraw again');
    await expectThrow(contract.withdrawFees({from: accounts[0]}));
  });

  it('should allow the mediator to withdraw all funds after the withdrawal period finishes');
});
