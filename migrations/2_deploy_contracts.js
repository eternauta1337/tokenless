/*eslint no-undef: "off"*/

var Market = artifacts.require("./Market.sol");

module.exports = function(deployer) {

  const statement = "The first draft of tokenless will be delivered next Friday.";
  const durationInBlocks = 20;

  deployer.deploy(Market,
    statement,
    durationInBlocks
  );
};
