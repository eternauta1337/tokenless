/*eslint no-undef: "off"*/

var Market = artifacts.require("./Market.sol");

module.exports = function(deployer) {

  const statement = "Bitcoin will be worth $5000 by October 2017.";
  const durationInBlocks = 5;

  deployer.deploy(Market,
    statement,
    durationInBlocks
  );
};
