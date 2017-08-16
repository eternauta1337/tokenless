/*eslint no-undef: "off"*/
const dateUtil = require('../src/utils/DateUtil');

const PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {

  let minWithdrawEndTimestampDelta = 0;

  deployer.deploy(
    PredictionMarket,
    minWithdrawEndTimestampDelta
  );
};
