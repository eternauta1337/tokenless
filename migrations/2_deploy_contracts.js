/*eslint no-undef: "off"*/
const dateUtil = require('../src/utils/DateUtil');

const PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {

  let minWithdrawEndTimestampDelta = 60;

  deployer.deploy(
    PredictionMarket,
    minWithdrawEndTimestampDelta
  );
};
