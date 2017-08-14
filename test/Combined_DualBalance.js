/*eslint no-undef: "off"*/
const MarketFactory = artifacts.require('./MarketFactory.sol');
const Market = artifacts.require('./Market.sol');
// import * as util from '../src/utils/Web3Util';

contract('', function(accounts) {

  it('(market) should support 2 balances for each player', async function() {

    let i;

    const contract = await Market.new('Bitcoin will reach $5000 in October 1.', 32);

    // Implement the following structure in the contract.
    const datas = [
      {playerIdx: 0, pos: 1, neg: 2},
      {playerIdx: 1, pos: 3, neg: 0},
      {playerIdx: 2, pos: 1, neg: 1},
      {playerIdx: 3, pos: 4, neg: 1},
      {playerIdx: 4, pos: 0, neg: 0},
      {playerIdx: 5, pos: 0, neg: 7.2}
    ];
    for(i = 0; i < datas.length; i++) {

      const data = datas[i];
      const addr = accounts[data.playerIdx];

      // Place bets.
      // console.log('placing pos bet:', data.pos);
      if(data.pos !== 0) {
        await contract.bet(true, {
          from: addr,
          value: web3.toWei(data.pos, 'ether')
        });
      }
      // console.log('placing neg bet:', data.neg);
      if(data.neg !== 0) {
        await contract.bet(false, {
          from: addr,
          value: web3.toWei(data.neg, 'ether')
        });
      }

      // Read balance.
      const pos = web3.fromWei(await contract.getPlayerBalance(true, {
        from: addr
      }), 'ether').toNumber();
      // console.log('pos:', pos);
      const neg = web3.fromWei(await contract.getPlayerBalance(false, {
        from: addr
      }), 'ether').toNumber();
      // console.log('neg:', neg);

      // Compare contract state with expected state.
      assert.equal(pos, data.pos, 'unmatching balance');
      assert.equal(neg, data.neg, 'unmatching balance');
    }
  });

  it('(factory+market) should support 2 balances for each player on contracts deployed by the factory', async function() {

    const factory = await MarketFactory.new();
    // console.log('factory address:', factory.address);

    // Create market.
    const creationTransaction = await factory.createMarket(
      'The market factory will work.', 10, {
        from: accounts[3]
      }
    );
    // console.log('creation transaction:', creationTransaction);

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    // console.log('marketAddress:', marketAddress);

    // Retrieve market.
    const contract = await Market.at(marketAddress);
    // console.log('market created');

    const statement = await contract.statement.call();
    // console.log('statement:', statement);
    assert.notEqual(statement.length, 0, 'invalid statement');

    let i;

    // Implement the following structure in the contract.
    const datas = [
      {playerIdx: 0, pos: 1, neg: 2},
      {playerIdx: 1, pos: 3, neg: 0},
      {playerIdx: 2, pos: 1, neg: 1},
      {playerIdx: 3, pos: 4, neg: 1},
      {playerIdx: 4, pos: 0, neg: 0},
      {playerIdx: 5, pos: 0, neg: 7.2}
    ];
    for(i = 0; i < datas.length; i++) {

      const data = datas[i];
      const addr = accounts[data.playerIdx];

      // Place bets.
      // console.log('placing pos bet:', data.pos);
      if(data.pos !== 0) {
        await contract.bet(true, {
          from: addr,
          value: web3.toWei(data.pos, 'ether')
        });
      }
      // console.log('placing neg bet:', data.neg);
      if(data.neg !== 0) {
        await contract.bet(false, {
          from: addr,
          value: web3.toWei(data.neg, 'ether')
        });
      }

      // Read balance.
      const pos = web3.fromWei(await contract.getPlayerBalance(true, {
        from: addr
      }), 'ether').toNumber();
      // console.log('pos:', pos);
      const neg = web3.fromWei(await contract.getPlayerBalance(false, {
        from: addr
      }), 'ether').toNumber();
      // console.log('neg:', neg);

      // Compare contract state with expected state.
      assert.equal(pos, data.pos, 'unmatching balance');
      assert.equal(neg, data.neg, 'unmatching balance');
    }
  });
});
