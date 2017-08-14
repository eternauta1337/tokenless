/*eslint no-undef: "off"*/
/*eslint no-unused-vars: "off"*/

const TruffleContract = require('truffle-contract');
const MarketArtifacts = require('../../build/contracts/PredictionMarket.json');
const PredictionArtifacts = require('../../build/contracts/Prediction.json');
const util = require('../../src/utils/Web3Util');
const constants = require('../../src/constants');

const addr0 = '0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39';

module.exports = async function(callback) {

  console.log('Running create_predictions...');

  // Retrieve deployed prediction prediction.
  const Market = TruffleContract(MarketArtifacts);
  Market.setProvider(web3.currentProvider);
  const market = await Market.at(constants.MARKET_FACTORY_ADDRESS);
  console.log('market retrieved');

  // Create a bunch of predictions.
  const Prediction = TruffleContract(PredictionArtifacts);
  Prediction.setProvider(web3.currentProvider);
  // createDeterministicPredictions(prediction, Prediction);
  createRandomPredictions(20, market, Prediction);

  callback();
};

// ---------------------
// DETERMINISTIC
// ---------------------

async function createDeterministicPredictions(market, Prediction) {
  console.log('createDeterministicPredictions()');
  const predictions = [
    {statement: 'Whrachikov will win the election.',
      duration: 1},
    {statement: 'The Mayans will return to earth in 2018',
      duration: 10},
    {statement: 'Bitcoin will be worth $5000 by October 2017',
      duration: 100},
    {statement: 'Bitcoin will fork again in 2017',
      duration: 1000},
  ];
  for(let i = 0; i < predictions.length; i++) {

    // Create prediction.
    const prediction = predictions[i];
    const creationTransaction = await market.createPrediction(
      prediction.statement,
      prediction.duration, {
        from: addr0,
        gas: 1000000
      }
    );

    // Retrieve prediction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    console.log('prediction created:', predictionAddress);
  }
}

// ---------------------
// RANDOM
// ---------------------

async function createRandomPredictions(num, market, Prediction) {
  console.log('createRandomPredictions()', num);
  for(let i = 0; i < num; i++) {

    // Create prediction.
    const creationTransaction = await market.createPrediction(
      "Random prediction " + i,
      getRandomInt(1, 1000), {
        from: addr0,
        gas: 1000000
      }
    );

    // Retrieve prediction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    console.log('prediction created:', predictionAddress);
  }
}

// ---------------------
// UTILS
// ---------------------

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
