pragma solidity ^0.4.11;

import './Prediction.sol';

contract PredictionMarket {

  address[] predictions;

  function getPredictions() constant returns (address[]) {
    return predictions;
  }
  
  // --------------------------------------------------
  // Init
  // --------------------------------------------------
  
  uint public minWithdrawEndTimestampDelta;
  uint public feePercent;

  function PredictionMarket(uint _minWithdrawEndTimestampDelta, uint _feePercent) {
    minWithdrawEndTimestampDelta = _minWithdrawEndTimestampDelta;
    feePercent = _feePercent;
  }

  // ---------------------
  // Creation
  // ---------------------

  event PredictionCreatedEvent(Prediction predictionAddress);

  function createPrediction(string statement, uint betEndTimestamp, uint withdrawEndTimestamp) {

      // Contain withdraw end timestamp.
      uint delta = withdrawEndTimestamp - betEndTimestamp;
      uint adjustedWithdrawEndTimestamp = withdrawEndTimestamp;
      if(delta < minWithdrawEndTimestampDelta) {
          adjustedWithdrawEndTimestamp += minWithdrawEndTimestampDelta;
      }

      // Crate prediction and store address.
      Prediction prediction = new Prediction(statement, betEndTimestamp, adjustedWithdrawEndTimestamp, feePercent);
      predictions.push(prediction);

      // Transfer ownership to whoever called for
      // the creation of the prediction (i.e. not this prediction).
      prediction.transferOwnership(msg.sender);

      PredictionCreatedEvent(prediction);
  }
}

















