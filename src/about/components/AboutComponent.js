import React, { Component } from 'react';

class AboutComponent extends Component {
  render() {
    return(
      <div>

        <div className="container">

          {/* WHAT IS */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>What is tokenless.pm?</strong>
            </div>
            <div className="panel-body">
              Tokenless Prediction Market is a simple decentralized prediction market running on the Ethereum blockchain.
              Anyone can create a prediction, and anyone can bet on it with a simple yes or no. When the prediction becomes resolved,
              all players can withdraw prizes, and the creator of the prediction can claim a small fee. Thats it. No tokens, no unnecessary
              complexity, just predictions.
            </div>
          </div>

          {/* HOW TO PLAY  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>How to play?</strong>
            </div>
            <div className="panel-body">
              Head over to /create and input the title of your prediction. Make sure that the title properly defines the prediction, and that it
              can be solved to yes/no. Below it, you can specify a date in which the prediction is supposed to be resolved. Upon this date, the owner
              will be able to resolve the prediction, and players will
              no longer be able to place bets on the prediction any more. There is a second date below, which determines the amount of time players have from the
              resolution date to withdraw their prizes. After this second date, the creator of the prediction will be able to withdraw a small fee and whatever
              players didn't withdraw in the withdrawal period. Creating a prediction costs money because it gets saved in the blockchain and begins the life cycle
              of a smart contract.<br/>
              As a player, you can select a prediction and, depending on its state, bet on it. You will be able to track your bets and see other people's bets. Once the
              owner of the prediction resolves it, you will be able to withdraw your prize (if you have one). An owner cannot destroy the prediction or withdraw any funds
              from it until the withdrawal date arrives.<br/>
            </div>
          </div>

          {/* RULES  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Rules</strong>
            </div>
            <div className="panel-body">
              The following set of rules are enforced by the smart contracts:
              <ul>
                <li>Owners cannot bet on their own predictions.</li>
                <li>Owners cannot destroy a prediction.</li>
                <li>Owners cannot withdraw funds from a prediction until the withdrawal end date.</li>
                <li>Playes can bet both positively and negatively on any prediction. The contract will track a separate pair of balances for each player.</li>
                <li>Owners can resolve the prediction to yes/no after the bet end date.</li>
                <li>The resolution of a prediction cannot be retracted.</li>
                <li>A bet by a player cannot be retracted.</li>
                <li>A prediction cannot be deleted (by anyone).</li>
              </ul>
            </div>
          </div>

          {/* PRIZES & FEES  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Prizes and Fees</strong>
            </div>
            <div className="panel-body">
              When a prediction is resolved, it will have a pair of total positive and negative balances composed of all the positive and negative bets.
              Depending on the resolved outcome, one of these 2 pots will be a winning pot and the other a losing pot. All funds in the winning pot
              will be withdrawable by the winners and the losing pot will also be distributed amongst the winners depending on the fraction of the winning pot they own.
              For example, if I bet 1 eth on yes and that represents 1% of the winning pot, and the losing pot sums up to 200 eth, then I will be able
              to claim my 1 eth back, as well as 1% of 200 eth, totalling 3 eth. Well, not quite, there is a small percentage fee that is left behind in the
              contract for the owner of the prediction to claim, usually 2%.
            </div>
          </div>

          {/* UNDER THE HOOD  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Under the Hood</strong>
            </div>
            <div className="panel-body">
              All blockchain side logic is controlled by 2 smart contracts: 1) A single PredictionMarket and 2) many Predictions. When a player creates a Prediction,
              he interacts with the PredictionMarket, which enforces a set of conditions to ensure the proper creation of it, as well as transferring
              ownership of the Prediction to the creator. Once this happens succesfully, a new smart contract will exist and everyone will be able
              to interact with it. The PredictionMarket will be able to keep track of it, but it will not be able to destroy it. For more
              details you can see the code of the smart contracts in the github link in the footer of this page.
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default AboutComponent;
