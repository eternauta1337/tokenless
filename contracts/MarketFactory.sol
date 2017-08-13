pragma solidity ^0.4.11;

import './Market.sol';

contract MarketFactory {

  address[] markets;

  function getMarkets() constant returns (address[]) {
    return markets;
  }

  // ---------------------
  // Creation
  // ---------------------

  event MarketCreatedEvent(Market marketAddress);

  function createMarket(string statement, uint blockDuration) {

      // Crate market and store address.
      Market market = new Market(statement, blockDuration);
      markets.push(market);

      // Transfer ownership to whoever called for
      // the creation of the market (i.e. not this factory).
      market.transferOwnership(msg.sender);

      MarketCreatedEvent(market);
  }

  // ---------------------
  // Deletion
  // ---------------------

  event MarketDeletedEvent(address marketAddress);

  function forgetMarket(address market) {
    if(markets.length == 0) return;

    // Find element.
    uint idx = 0;
    bool found;
    for(uint i = 0; i < markets.length; i++) {
      address marketAddr = markets[i];
      if(marketAddr == market) {
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
    address lastMarket = markets[markets.length - 1];
    markets[idx] = lastMarket;
    markets.length--;

    MarketDeletedEvent(market);
  }
}
