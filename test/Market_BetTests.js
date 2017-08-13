/*eslint no-undef: "off"*/
const Market = artifacts.require('./Market.sol');
import * as util from '../src/utils/Web3Util';

contract('Market (Bets)', function(accounts) {

  before(() => {
    // console.log('accounts:', web3.eth.accounts);
  });

  it('should accepts funds via bets', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    const playerAddress = accounts[1];
    const initialPlayerBalance = util.getBalanceInEther(playerAddress, web3);
    const betValueEth = 1;
    await contract.bet(true, {
      from: playerAddress,
      value: web3.toWei(betValueEth, 'ether')
    });

    const newPlayerBalance = util.getBalanceInEther(playerAddress, web3);
    // console.log('newPlayerBalance', newPlayerBalance);
    const newContractBalance = util.getBalanceInEther(contract.address, web3);
    // console.log('newContractBalance', newContractBalance);

    assert.approximately(initialPlayerBalance - betValueEth, newPlayerBalance, 0.01, 'player balance was not deducted');
    assert.equal(1, newContractBalance, 'contract balance was not increased');
  });

  it('should keep track of a players positive bet balance', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(2, 'ether')
    });

    const playerPosBalance = web3.fromWei(await contract.getPlayerBalance(true, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('player 1 pos balance: ', playerBalance);
    assert.equal(1, playerPosBalance, 'player balance was not tracked');

    const playerNegBalance = web3.fromWei(await contract.getPlayerBalance(false, {
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('player 1 neg balance: ', playerBalance);
    assert.equal(2, playerNegBalance, 'player balance was not tracked');
  });

  it('should not keep a balance for a player that didnt bet', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    const playerBalance = web3.fromWei(await contract.getPlayerBalance(Math.random() > 0.5, {
      from: accounts[2]
    }), 'ether');
    // console.log('player 2 balance: ', player2Balance);

    assert.equal(0, playerBalance, 'player wasnt supposed to have a balance');
  });

  it('should expose pot totals', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

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

    const positivePredicionBalance = web3.fromWei((await contract.getPredictionBalance(true)).toNumber());
    const negativePredicionBalance = web3.fromWei((await contract.getPredictionBalance(false)).toNumber());
    // console.log('positivePredicionBalance', positivePredicionBalance);
    // console.log('negativePredicionBalance', negativePredicionBalance);

    assert.equal(positivePredicionBalance, 5, 'incorrect prediction balance');
    assert.equal(negativePredicionBalance, 3, 'incorrect prediction balance');
  });

});
