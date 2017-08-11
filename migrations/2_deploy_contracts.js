/*eslint no-undef: "off"*/

var Market = artifacts.require("./Market.sol");
var MarketFactory = artifacts.require("./MarketFactory.sol");

module.exports = function(deployer) {

  // Create a single market.
  const statement = "Bitcoin will be worth $5000 by October 2017.";
  const durationInBlocks = 5;
  deployer.deploy(Market,
    statement,
    durationInBlocks
  );

  // Create a market factory.
  deployer.deploy(MarketFactory);
};
