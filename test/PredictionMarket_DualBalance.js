/*eslint no-undef: "off"*/
const PredictionMarket = artifacts.require('./PredictionMarket.sol');
const Prediction = artifacts.require('./Prediction.sol');
// import * as util from '../src/utils/Web3Util';

contract('', function(accounts) {

  it('(prediction) should support 2 balances for each user', async function() {

    let i;

    const contract = await Prediction.new('Bitcoin will reach $5000 in October 1.', 32);

    // Implement the following structure in the contract.
    const datas = [
      {userIdx: 0, pos: 1, neg: 2},
      {userIdx: 1, pos: 3, neg: 0},
      {userIdx: 2, pos: 1, neg: 1},
      {userIdx: 3, pos: 4, neg: 1},
      {userIdx: 4, pos: 0, neg: 0},
      {userIdx: 5, pos: 0, neg: 7.2}
    ];
    for(i = 0; i < datas.length; i++) {

      const data = datas[i];
      const addr = accounts[data.userIdx];

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
      const pos = web3.fromWei(await contract.getUserBalance(true, {
        from: addr
      }), 'ether').toNumber();
      // console.log('pos:', pos);
      const neg = web3.fromWei(await contract.getUserBalance(false, {
        from: addr
      }), 'ether').toNumber();
      // console.log('neg:', neg);

      // Compare contract state with expected state.
      assert.equal(pos, data.pos, 'unmatching balance');
      assert.equal(neg, data.neg, 'unmatching balance');
    }
  });

  it('(prediction+prediction) should support 2 balances for each user on contracts deployed by the prediction', async function() {

    const prediction = await PredictionMarket.new();
    // console.log('prediction address:', prediction.address);

    // Create prediction.
    const creationTransaction = await prediction.createPrediction(
      'The prediction prediction contract will work.', 10, {
        from: accounts[3]
      }
    );
    // console.log('creation transaction:', creationTransaction);

    // Prediction address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    // console.log('predictionAddress:', predictionAddress);

    // Retrieve prediction.
    const contract = await Prediction.at(predictionAddress);
    // console.log('prediction created');

    const statement = await contract.statement.call();
    // console.log('statement:', statement);
    assert.notEqual(statement.length, 0, 'invalid statement');

    let i;

    // Implement the following structure in the contract.
    const datas = [
      {userIdx: 0, pos: 1, neg: 2},
      {userIdx: 1, pos: 3, neg: 0},
      {userIdx: 2, pos: 1, neg: 1},
      {userIdx: 3, pos: 4, neg: 1},
      {userIdx: 4, pos: 0, neg: 0},
      {userIdx: 5, pos: 0, neg: 7.2}
    ];
    for(i = 0; i < datas.length; i++) {

      const data = datas[i];
      const addr = accounts[data.userIdx];

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
      const pos = web3.fromWei(await contract.getUserBalance(true, {
        from: addr
      }), 'ether').toNumber();
      // console.log('pos:', pos);
      const neg = web3.fromWei(await contract.getUserBalance(false, {
        from: addr
      }), 'ether').toNumber();
      // console.log('neg:', neg);

      // Compare contract state with expected state.
      assert.equal(pos, data.pos, 'unmatching balance');
      assert.equal(neg, data.neg, 'unmatching balance');
    }
  });
});
