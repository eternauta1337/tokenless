/*eslint no-undef: "off"*/

import * as util from '../src/utils/Web3Util';

import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';

const Market = artifacts.require('./Market.sol');

// Tests
contract('Basic Tests (Market)', function(accounts) {

  after(() => {
    console.log('⚑ done.');
  });

  // --------------------------------------------------
  // General
  // --------------------------------------------------

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

  it('should expire after N blocks');

  // --------------------------------------------------
  // Bets
  // --------------------------------------------------

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

    for(let i = 0; i < 2; i++) {
      await contract.bet(true, {
        from: accounts[1],
        value: web3.toWei(1, 'ether')
      });
    }

    const playerBalance = web3.fromWei(await contract.getPlayerBalance({
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('player 1 balance: ', playerBalance);

    assert.equal(2, playerBalance, 'player balance was not tracked');
  });

  it('should not keep a balance for a player that didnt bet', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    const playerBalance = web3.fromWei(await contract.getPlayerBalance({
      from: accounts[2]
    }), 'ether');
    // console.log('player 2 balance: ', player2Balance);

    assert.equal(0, playerBalance, 'player wasnt supposed to have a balance');
  });

  it('should keep track of player predictions', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    let prediction = await contract.getPlayerPrediction({
      from: accounts[1]
    });

    assert.equal(prediction, true, 'prediction should be true');

    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    prediction = await contract.getPlayerPrediction({
      from: accounts[1]
    });

    assert.equal(prediction, false, 'prediction should be false');
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

  // --------------------------------------------------
  // Resolution
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Prize withdrawals
  // --------------------------------------------------

  it('should allow winners to withdraw their prize', async function() {

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 5);

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

    util.skipBlocks(5, web3);

    await contract.resolve(true, {from: accounts[0]});

    // Losers should not be able to withdraw.
    await expectThrow(contract.claimPrize({from: accounts[2]}));
    await expectThrow(contract.claimPrize({from: accounts[3]}));

    const initPlayerBalance = util.getBalanceInEther(accounts[1], web3);
    // console.log('initPlayerBalance', initPlayerBalance);
    await contract.claimPrize({from: accounts[1]});
    await contract.withdrawPayments({from: accounts[1]});
    const newPlayerBalance = util.getBalanceInEther(accounts[1], web3);
    // console.log('newPlayerBalance', newPlayerBalance);
    const prize = 1 + 2 * 0.98;
    const expectedNewPlayerBalance = initPlayerBalance + prize;
    // console.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newPlayerBalance, expectedNewPlayerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    web3.fromWei(await contract.getPlayerBalance({
      from: accounts[1]
    }), 'ether').toNumber();
    // console.log('remainingBalance: ', remainingBalance);
    await expectThrow(contract.claimPrize({from: accounts[1]}));
  });

  // --------------------------------------------------
  // Owner withdrawals
  // --------------------------------------------------

  it('should allow the owner to destroy the contract a certain time after resolution, claiming whatever no one else claimed');
});
