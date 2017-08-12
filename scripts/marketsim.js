/*eslint no-undef: "off"*/

var TruffleContract = require('truffle-contract');
var FactoryArtifacts = require('../build/contracts/MarketFactory.json');
var MarketArtifacts = require('../build/contracts/Market.json');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

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
  for(let i = 0; i < 10; i++) {
    const duration = getRandomInt(1, 100);
    console.log('creating market:', i, duration);

    // Create market.
    const creationTransaction = await factory.createMarket(
      `This is sample market: ${i}`,
      duration, {
        from: '0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39',
        gas: 1000000
      }
    );

    // Retrieve market.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    console.log('market created:', marketAddress);
  }

  callback();
};
