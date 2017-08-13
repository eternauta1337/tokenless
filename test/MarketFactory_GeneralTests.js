/*eslint no-undef: "off"*/
const MarketFactory = artifacts.require('./MarketFactory.sol');
const Market = artifacts.require('./Market.sol');

contract('MarketFactory (General)', function(accounts) {

  before(() => {
    // console.log('accounts:', web3.eth.accounts);
  });

  it('should be able to create a market with transferred ownership', async function() {
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
    const market = await Market.at(marketAddress);
    const statement = await market.statement.call();
    // console.log('market statement: ', statement);
    assert.notEqual(statement.length, 0, 'text is invalid');

    // Verify owner.
    const marketOwner = await market.owner.call();
    // console.log('market owned by: ', marketOwner);
    assert.notEqual(marketOwner, 0, 'invalid owner');
    assert.notEqual(marketOwner, factory.address, 'invalid owner');
  });

  it('should keep track of multiple markets', async function() {
    const factory = await MarketFactory.new();

    // Create a few markets and recall their addresse.
    const localAddresses = [];
    localAddresses.push((await factory.createMarket(
      'Market 0.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);
    localAddresses.push((await factory.createMarket(
      'Market 1.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);
    localAddresses.push((await factory.createMarket(
      'Market 2.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);
    // console.log('localAddresses', localAddresses);

    // Ask the factory for its addresses.
    const remoteAddresses = await factory.getMarkets();
    // console.log('remoteAddresses', remoteAddresses);

    assert.equal(localAddresses.length, remoteAddresses.length, 'num addresses mismatch');
  });

  it('should be able to forget markets', async function() {

    const factory = await MarketFactory.new();

    // Create a few markets and recall their addresse.
    const localAddresses = [];
    localAddresses.push((await factory.createMarket(
      'Market 0.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);
    localAddresses.push((await factory.createMarket(
      'Market 1.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);
    localAddresses.push((await factory.createMarket(
      'Market 2.', 10, {from: accounts[0]}
    )).logs[0].args.marketAddress);

    // Verify num.
    let remoteAddresses = await factory.getMarkets();
    // console.log('markets:', remoteAddresses);
    assert.equal(remoteAddresses.length, 3, 'num addresses mismatch');

    // Remove 1 market.
    await factory.forgetMarket(localAddresses[1]);

    // Verify num.
    remoteAddresses = await factory.getMarkets();
    // console.log('markets:', remoteAddresses);
    assert.equal(remoteAddresses.length, 2, 'num addresses mismatch');

  });

  it.only('should support 2 balances for each player on contracts deployed by the factory', async function() {

    const factory = await MarketFactory.new();
    console.log('factory address:', factory.address);

    // Create market.
    const creationTransaction = await factory.createMarket(
      'The market factory will work.', 10, {
        from: accounts[3]
      }
    );
    console.log('creation transaction:', creationTransaction);

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    console.log('marketAddress:', marketAddress);

    // Retrieve market.
    const contract = await Market.at(marketAddress);
    console.log('market created');

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
