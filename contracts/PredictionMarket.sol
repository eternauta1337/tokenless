pragma solidity ^0.4.11;

import './Prediction.sol';

contract PredictionMarket {

  address[] predictions;

  function getPredictions() constant returns (address[]) {
    return predictions;
  }

  // ---------------------
  // Creation
  // ---------------------

  event PredictionCreatedEvent(Prediction predictionAddress);

  function createPrediction(string statement, uint blockDuration) {

      // Crate prediction and store address.
      Prediction prediction = new Prediction(statement, blockDuration);
      predictions.push(prediction);

      // Transfer ownership to whoever called for
      // the creation of the prediction (i.e. not this prediction).
      prediction.transferOwnership(msg.sender);

      PredictionCreatedEvent(prediction);
  }
}
