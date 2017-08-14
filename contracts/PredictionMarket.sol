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

  // ---------------------
  // Deletion
  // ---------------------

  event PredictionDeletedEvent(address predictionAddress);

  function forgetPrediction(address prediction) {
    if(predictions.length == 0) return;

    // Find element.
    uint idx = 0;
    bool found;
    for(uint i = 0; i < predictions.length; i++) {
      address predicionAddr = predictions[i];
      if(predicionAddr == prediction) {
        idx = i;
        found = true;
        break;
      }
    }
    if(!found) return;

    // Deletion in solidity simply empties the data,
    // leaving a 'hole' in the array.
    // Solution is to move the last element into the gap
    // instead of delete array[idx].
    address lastPrediction = predictions[predictions.length - 1];
    predictions[idx] = lastPrediction;
    predictions.length--;

    PredictionDeletedEvent(prediction);
  }
}
