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

  it('should allow the owner to withdraw the contract balance a certain time after resolution, claiming whatever no one else claimed', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    let state = 0;
    // console.log('time: ', await util.getTimestamp(web3));

    // Make a few bets.
    // console.log('make a few bets');
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

    // Skip bets.
    // console.log('skip bets');
    await util.skipTime(dateUtil.daysToSeconds(6), web3);

    // Resolve.
    // console.log('resolve');
    await contract.resolve(true, {from: accounts[0]});

    // Try to claim fees early.
    // console.log('claim fees early');
    await expectThrow(contract.withdrawFees({from: accounts[0]}));

    // Withdraw winner.
    // console.log('withdraw winner');
    const initContractBalance = await util.getBalanceInEther(contract.address, web3);
    // console.log('init contract balance:', initContractBalance);
    // console.log('init player balance:', await util.getBalanceInEther(accounts[1], web3));
    await contract.withdrawPrize({from: accounts[1]});
    // console.log('new player balance:', await util.getBalanceInEther(accounts[1], web3));
    const withdrawnContractBalance = await util.getBalanceInEther(contract.address, web3);
    // console.log('withdrawn contract balance:', withdrawnContractBalance);

    // Skip withdrawal phase.
    // console.log('skip withdraw');
    await util.skipTime(dateUtil.daysToSeconds(11), web3);

    // Should work now...
    // console.log('claim fees at right time');
    const initOwnerBalance = await util.getBalanceInEther(accounts[0], web3);
    // console.log('init owner balance:', initOwnerBalance);
    await contract.withdrawFees({from: accounts[0]});
    state = (await contract.getState()).toNumber();
    // console.log('state:', state);
    assert.equal(3, state, 'incorrect contract state');

    // Check owner balance
    // console.log('check owner balance');
    const newOwnerBalance = await util.getBalanceInEther(accounts[0], web3);
    // console.log('new owner balance:', newOwnerBalance);
    const expectedNewOwnerBalance = initOwnerBalance + withdrawnContractBalance;
    // console.log('expectedNewOwnerBalance:', expectedNewOwnerBalance);
    assert.approximately(newOwnerBalance, expectedNewOwnerBalance, 0.01, 'expected owner balance is incorrect');
  });
});
