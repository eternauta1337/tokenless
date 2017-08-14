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

});
