pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/payment/PullPayment.sol";

contract Market is Ownable, PullPayment {

  using SafeMath for uint;

  // --------------------------------------------------
  // Init
  // --------------------------------------------------

  string public statement;

  function Market(string _statement, uint _blockDuration) {
    statement = _statement;
    endBlock = block.number.add(_blockDuration);
  }

  // --------------------------------------------------
  // Placing bets
  // --------------------------------------------------

  struct Bet {
    bool prediction;
    uint balance;
  }

  mapping(address => Bet) public bets;
  mapping(bool => uint) public totals;

  function bet(bool prediction) payable onlyInState(State.Open) {
    bets[msg.sender] = Bet({
      prediction: prediction,
      balance: bets[msg.sender].balance.add(msg.value)
    });
    totals[prediction] = totals[prediction].add(msg.value);
  }

  function getPlayerBalance() constant returns (uint) {
    return bets[msg.sender].balance;
  }

  function getPlayerPrediction() constant returns (bool) {
    return bets[msg.sender].prediction;
  }

  // --------------------------------------------------
  // Resolution
  // --------------------------------------------------

  bool public outcome;

  function resolve(bool _outcome) onlyOwner onlyInState(State.Closed) {
    outcome = _outcome;
    resolved = true;
  }

  // --------------------------------------------------
  // Prize withdrawals
  // --------------------------------------------------

  function claimPrize() onlyInState(State.Resolved) {

    /*
      The balance is split between a losing and a winning pot.
      Winners take chunks away from the losing pot according to the percentage
      they represented in the winning pot, as well as recovering their original bet.
      A small fee of the loser takeaway chunk is retained for the contract owner.
    */

    uint feePercent = 2;

    Bet memory bet = bets[msg.sender];
    if(bet.prediction != outcome) { revert(); }
    if(bet.balance == 0) { revert(); }

    uint winningPot = totals[outcome];
    uint losingPot = totals[!outcome];

    uint winPercentage = bet.balance.div(winningPot);
    uint loserChunk = winPercentage.mul(losingPot);
    uint fee = loserChunk.mul(feePercent).div(100);
    uint prize = loserChunk.sub(fee).add(bet.balance);

    asyncSend(msg.sender, prize);
    bet.balance = 0;
    bets[msg.sender] = bet;
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  uint public endBlock;
  bool private resolved;
  enum State { Open, Closed, Resolved }

  modifier onlyInState(State _state) {
    if(getState() != _state) { revert(); }
    _;
  }

  function getState() constant returns (State) {
    if(!resolved) {
      if(block.number <= endBlock) {
        return State.Open;
      }
      else {
        return State.Closed;
      }
    }
    else {
      return State.Resolved;
    }
  }

  // --------------------------------------------------
  // Debugging methods
  // (could be removed without hurting the contract)
  // --------------------------------------------------

  function getBlockNumber() constant returns (uint) {
    return block.number;
  }

  // --------------------------------------------------
  // Destruction
  // --------------------------------------------------

  /*function destroy() onlyOwner stateIs(State.Finished) {
    super.destroy();
  }*/
}
