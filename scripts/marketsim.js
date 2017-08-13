/*eslint no-undef: "off"*/
/*eslint no-unused-vars: "off"*/

var TruffleContract = require('truffle-contract');
var FactoryArtifacts = require('../build/contracts/MarketFactory.json');
var MarketArtifacts = require('../build/contracts/Market.json');
var util = require('../src/utils/Web3Util');

var addr0 = '0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39';

module.exports = async function(callback) {

  console.log('Running marketsim...');

  // Retrieve deployed market factory.
  const Factory = TruffleContract(FactoryArtifacts);
  Factory.setProvider(web3.currentProvider);
  const factory = await Factory.at('0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a');
  console.log('market factory retrieved');

  // Create a bunch of markets.
  const Market = TruffleContract(MarketArtifacts);
  Market.setProvider(web3.currentProvider);
  // createDeterministicMarkets(factory, Market);
  createRandomMarkets(20, factory, Market);

  callback();

  require('repl').start({});
};

// ---------------------
// DETERMINISTIC
// ---------------------

async function createDeterministicMarkets(factory, Market) {
  console.log('createDeterministicMarkets()');
  const markets = [
    {statement: 'Whrachikov will win the election.',
      duration: 1},
    {statement: 'The Mayans will return to earth in 2018',
      duration: 10},
    {statement: 'Bitcoin will be worth $5000 by October 2017',
      duration: 100},
    {statement: 'Bitcoin will fork again in 2017',
      duration: 1000},
  ];
  for(let i = 0; i < markets.length; i++) {

    // Create market.
    const market = markets[i];
    const creationTransaction = await factory.createMarket(
      market.statement,
      market.duration, {
        from: addr0,
        gas: 1000000
      }
    );

    // Retrieve market.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    console.log('market created:', marketAddress);
  }
}

// ---------------------
// RANDOM
// ---------------------

async function createRandomMarkets(num, factory, Market) {
  console.log('createRandomMarkets()', num);
  for(let i = 0; i < num; i++) {

    // Create market.
    const creationTransaction = await factory.createMarket(
      "Random market " + i,
      getRandomInt(1, 1000), {
        from: addr0,
        gas: 1000000
      }
    );

    // Retrieve market.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    console.log('market created:', marketAddress);
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
