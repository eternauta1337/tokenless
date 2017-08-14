/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from '../src/utils/Web3Util';

contract('Prediction (Bets)', function(accounts) {

  before(() => {
    // console.log('accounts:', web3.eth.accounts);
  });

  it('should accepts funds via bets', async function() {

    const contract = await Prediction.new('Bitcoin will reach $5000 in October 1.', 32);

    const userAddress = accounts[1];
    const initialUserBalance = util.getBalanceInEther(userAddress, web3);
    const betValueEth = 1;
    await contract.bet(true, {
      from: userAddress,
      value: web3.toWei(betValueEth, 'ether')
    });

    const newUserBalance = util.getBalanceInEther(userAddress, web3);
    // console.log('newUserBalance', newUserBalance);
    const newContractBalance = util.getBalanceInEther(contract.address, web3);
    // console.log('newContractBalance', newContractBalance);

    assert.approximately(initialUserBalance - betValueEth, newUserBalance, 0.01, 'user balance was not deducted');
    assert.equal(1, newContractBalance, 'contract balance was not increased');
  });

  it('should keep track of a users positive bet balance', async function() {

    const contract = await Prediction.new('Bitcoin will reach $5000 in October 1.', 32);

    let userNullBalance = web3.fromWei(await contract.getUserBalance(true, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('user 1 null balance: ', userBalance);
    assert.equal(0, userNullBalance, 'user balance supposed to be 0');
    userNullBalance = web3.fromWei(await contract.getUserBalance(false, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('user 1 null balance: ', userBalance);
    assert.equal(0, userNullBalance, 'user balance supposed to be 0');

    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(2, 'ether')
    });

    const userPosBalance = web3.fromWei(await contract.getUserBalance(true, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('user 1 pos balance: ', userBalance);
    assert.equal(1, userPosBalance, 'user balance was not tracked');

    const userNegBalance = web3.fromWei(await contract.getUserBalance(false, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('user 1 neg balance: ', userBalance);
    assert.equal(2, userNegBalance, 'user balance was not tracked');
  });

  it('should not keep a balance for a user that didnt bet', async function() {

    const contract = await Prediction.new('Bitcoin will reach $5000 in October 1.', 32);

    let userBalance = web3.fromWei(await contract.getUserBalance(false, {
      from: accounts[2]
    }), 'ether');
    userBalance = web3.fromWei(await contract.getUserBalance(true, {
      from: accounts[2]
    }), 'ether');
    // console.log('user 2 balance: ', user2Balance);

    assert.equal(0, userBalance, 'user wasnt supposed to have a balance');
  });

  it('should expose pot totals', async function() {

    const contract = await Prediction.new('Bitcoin will reach $5000 in October 1.', 32);

    let i;
    for(i = 0; i < 5; i++) {
      await contract.bet(true, {
        from: accounts[1],
        value: web3.toWei(1, 'ether')
      });
      await util.delay(1000);
      // console.log('positive bet');
    }
    for(i = 0; i < 3; i++) {
      await contract.bet(false, {
        from: accounts[1],
        value: web3.toWei(1, 'ether')
      });
      await util.delay(1000);
      // console.log('negative bet');
    }

    const positivePredicionBalance = web3.fromWei((await contract.totals.call(true)).toNumber());
    const negativePredicionBalance = web3.fromWei((await contract.totals.call(false)).toNumber());
    // console.log('positivePredicionBalance', positivePredicionBalance);
    // console.log('negativePredicionBalance', negativePredicionBalance);

    assert.equal(positivePredicionBalance, 5, 'incorrect prediction balance');
    assert.equal(negativePredicionBalance, 3, 'incorrect prediction balance');
  });
});
