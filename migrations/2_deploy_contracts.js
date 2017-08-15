/*eslint no-undef: "off"*/
const dateUtil = require('../src/utils/DateUtil');

const PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {

  let minWithdrawEndTimestampDelta = dateUtil.daysToSeconds(2);

  deployer.deploy(
    PredictionMarket,
    minWithdrawEndTimestampDelta
  );
};
