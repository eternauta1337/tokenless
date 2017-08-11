pragma solidity ^0.4.11;

import './Market.sol';

contract MarketFactory {

  address[] markets;
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

  function getMarkets() constant returns (address[]) {
    return markets;
  }
}
