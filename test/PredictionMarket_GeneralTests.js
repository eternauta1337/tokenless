/*eslint no-undef: "off"*/
const PredictionMarket = artifacts.require('./PredictionMarket.sol');
const Prediction = artifacts.require('./Prediction.sol');

contract('PredictionMarket (General)', function(accounts) {

  before(() => {
    // console.log('accounts:', web3.eth.accounts);
  });

  it('should be able to create a prediction with transferred ownership', async function() {
    const market = await PredictionMarket.new();
    // console.log('prediction address:', prediction.address);

    // Create prediction.
    const creationTransaction = await market.createPrediction(
      'The prediction prediction will work.', 10, {
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
    const prediction = await Prediction.at(predictionAddress);
    const statement = await prediction.statement.call();
    // console.log('prediction statement: ', statement);
    assert.notEqual(statement.length, 0, 'text is invalid');

    // Verify owner.
    const predictionOwner = await prediction.owner.call();
    // console.log('prediction owned by: ', predictionOwner);
    assert.notEqual(predictionOwner, 0, 'invalid owner');
    assert.notEqual(predictionOwner, prediction.address, 'invalid owner');
  });

  it('should keep track of multiple predictions', async function() {
    const prediction = await PredictionMarket.new();

    // Create a few predictions and recall their addresse.
    const localAddresses = [];
    localAddresses.push((await prediction.createPrediction(
      'Prediction 0.', 10, {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    localAddresses.push((await prediction.createPrediction(
      'Prediction 1.', 10, {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    localAddresses.push((await prediction.createPrediction(
      'Prediction 2.', 10, {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    // console.log('localAddresses', localAddresses);

    // Ask the prediction for its addresses.
    const remoteAddresses = await prediction.getPredictions();
    // console.log('remoteAddresses', remoteAddresses);

    assert.equal(localAddresses.length, remoteAddresses.length, 'num addresses mismatch');
  });
});
