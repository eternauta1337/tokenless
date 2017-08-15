/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Withdraw)', function(accounts) {

  it('should allow winners to withdraw their prize', async function() {

    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10)
    );

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

    util.skipTime(dateUtil.daysToSeconds(5), web3);

    await contract.resolve(true, {from: accounts[0]});

    // Losers should not be able to withdraw.
    await expectThrow(contract.claimPrize({from: accounts[2]}));
    await expectThrow(contract.claimPrize({from: accounts[3]}));

    const initPlayerBalance = await util.getBalanceInEther(accounts[1], web3);
    // console.log('initPlayerBalance', initPlayerBalance);
    await contract.claimPrize({from: accounts[1]});
    await contract.withdrawPayments({from: accounts[1]});
    const newPlayerBalance = await util.getBalanceInEther(accounts[1], web3);
    // console.log('newPlayerBalance', newPlayerBalance);
    const prize = 1 + 2 * 0.98;
    const expectedNewPlayerBalance = initPlayerBalance + prize;
    // console.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newPlayerBalance, expectedNewPlayerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    await expectThrow(contract.claimPrize({from: accounts[1]}));
  });

  it('should allow the owner to withdraw the contract balance a certain time after resolution, claiming whatever no one else claimed', async function() {

    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      util.currentSimulatedDateUnix + dateUtil.daysToSeconds(10)
    );
    let state = 0;

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

    util.skipTime(dateUtil.daysToSeconds(6), web3);

    await contract.resolve(true, {from: accounts[0]});

    const initContractBalance = await util.getBalanceInEther(contract.address, web3);
    console.log('init contract balance:', initContractBalance);

    // Too early to destroy...
    await expectThrow(contract.claimFees({from: accounts[0]}));

    console.log('init player balance:', await util.getBalanceInEther(accounts[1], web3));
    await contract.claimPrize({from: accounts[1]});
    await contract.withdrawPayments({from: accounts[1]});
    console.log('new player balance:', await util.getBalanceInEther(accounts[1], web3));

    const withdrawnContractBalance = await util.getBalanceInEther(contract.address, web3);
    console.log('withdrawn contract balance:', withdrawnContractBalance);

    util.skipTime(dateUtil.daysToSeconds(11), web3);

    // Should work now...
    const initOwnerBalance = await util.getBalanceInEther(accounts[0], web3);
    console.log('init owner balance:', initOwnerBalance);
    state = (await contract.getState()).toNumber();
    console.log('state:', state);
    contract.claimFees({from: accounts[0]});
    await contract.withdrawPayments({from: accounts[0]});

    // Check owner balance
    const newOwnerBalance = await util.getBalanceInEther(accounts[0], web3);
    console.log('new owner balance:', newOwnerBalance);
    const expectedNewOwnerBalance = initOwnerBalance + withdrawnContractBalance;
    console.log('expectedNewOwnerBalance:', expectedNewOwnerBalance);
    assert.approximately(newOwnerBalance, expectedNewOwnerBalance, 0.01, 'expected owner balance is incorrect');
  });
});
