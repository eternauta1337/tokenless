/*eslint no-undef: "off"*/

var MarketFactory = artifacts.require("./MarketFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(MarketFactory);
};
