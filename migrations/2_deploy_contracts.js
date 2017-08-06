/*eslint no-undef: "off"*/

var Market = artifacts.require("./Market.sol");

module.exports = function(deployer) {

  const statement = "The Mayans will return to earth on November 2017.";
  const blockDuration = 150000;

  deployer.deploy(Market,
    statement,
    blockDuration
  );
};
