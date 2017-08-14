/*eslint no-undef: "off"*/

var PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(PredictionMarket);
};
