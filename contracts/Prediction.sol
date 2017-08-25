pragma solidity ^0.4.11;

import "./zeppelin-solidity/contracts/math/SafeMath.sol";
import "./zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Prediction is Ownable {

  using SafeMath for uint;

  modifier notOwner() {
    require(msg.sender != owner);
    _;
  }

  // --------------------------------------------------
  // Init
  // --------------------------------------------------

  string public statement;
  
  uint public betEndTimestamp;
  uint public withdrawPeriod;
  uint public feePercent;

  function Prediction(string _statement, uint _betEndTimestamp, uint _withdrawPeriod, uint _feePercent) {
    require(_betEndTimestamp > now);

    statement = _statement;
    feePercent = _feePercent;
    betEndTimestamp = _betEndTimestamp;
    withdrawPeriod = _withdrawPeriod;
  }

  // --------------------------------------------------
  // Placing bets
  // --------------------------------------------------

  event BetEvent(address indexed from, bool prediction, uint value);

  mapping(bool => mapping(address => uint)) bets;
  mapping(bool => uint) public totals;

  function bet(bool prediction) payable notOwner() onlyInState(State.Open) {
    if(msg.value == 0) revert();

    // Update user's balances.
    uint pos = bets[true][msg.sender];
    uint neg = bets[false][msg.sender];
    bets[true][msg.sender] = prediction ? pos.add(msg.value) : pos;
    bets[false][msg.sender] = !prediction ? neg.add(msg.value) : neg;

    // Keep track in totals pot.
    totals[prediction] = totals[prediction].add(msg.value);

    BetEvent(msg.sender, prediction, msg.value);
  }

  function getUserBalance(bool outcome) constant returns (uint) {
    return bets[outcome][msg.sender];
  }

  // --------------------------------------------------
  // Resolution
  // --------------------------------------------------

  bool public outcome;
  uint public resolutionTimestamp;

  event ResolveEvent(bool selectedOutcome);

  function resolve(bool _outcome) onlyOwner onlyInState(State.Closed) {
    outcome = _outcome;
    resolved = true;
    resolutionTimestamp = now;
    ResolveEvent(outcome);
  }

  // --------------------------------------------------
  // Prize withdrawals
  // --------------------------------------------------

  event WithdrawPrizeEvent(address indexed from);

  function withdrawPrize() notOwner() onlyInState(State.Resolved) {

    // Calculate total prize.
    uint prize = calculatePrize(outcome);
    require(prize > 0);

    // Send funds.
    require(this.balance >= prize);
    assert(msg.sender.send(prize)); 
    
    // Reset bets.
    bets[true][msg.sender] = 0;
    bets[false][msg.sender] = 0;

    WithdrawPrizeEvent(msg.sender);
  }

  function calculatePrize(bool prediction) onlyInState(State.Resolved) constant returns (uint) {

    /*
      The balance is split between a losing and a winning pot.
      Winners take chunks away from the losing pot according to the percentage
      they represented in the winning pot, as well as recovering their original bet.
      A small fee of the loser takeaway chunk is retained for the contract owner.
    */

    // No prize if outcome is not matched.
    if(prediction != outcome) return 0;

    uint balance = bets[prediction][msg.sender];
    if(balance == 0) return 0;

    uint winningPot = totals[outcome];
    uint losingPot = totals[!outcome];

    uint winPercentage = balance.div(winningPot);
    uint loserChunk = winPercentage.mul(losingPot);
    uint fee = loserChunk.mul(feePercent).div(100);
    uint prize = loserChunk.sub(fee).add(balance);

    return prize;
  }

  // --------------------------------------------------
  // Fee withdrawals
  // --------------------------------------------------

  bool public feesWithdrawn = false;

  event WithdrawFeesEvent(address indexed from);

  function withdrawFees() onlyOwner onlyInState(State.Resolved) {
    require(!feesWithdrawn);

    // Calculate total prize.
    uint fees = calculateFees();
    require(fees > 0);

    require(this.balance >= fees);
    assert(owner.send(fees));
    feesWithdrawn = true;

    WithdrawFeesEvent(msg.sender);
  }

  function calculateFees() onlyInState(State.Resolved) constant returns (uint) {
    uint losingPot = totals[!outcome];
    uint totalFee = losingPot.mul(feePercent).div(100);
    return totalFee;
  }

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  bool public resolved;
  enum State { Open, Closed, Resolved, Finished }

  modifier onlyInState(State _state) {
    if(_state != getState()) { revert(); }
    _;
  }

  function getState() constant returns (State) {
    if(!resolved) {
      if(now < betEndTimestamp) return State.Open;
      else return State.Closed;
    }
    else {
      if(this.balance > 0) return State.Resolved;
      else return State.Finished;
    }
  }
}















