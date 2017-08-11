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
});
