import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  render() {
    return(
      <div>

        <div className="container">

          {/* HEADER */}
          <div className='jumbotron'>
            <div className="container">
              <h1>Tokenless</h1>
              <p>No tokens, just ether.</p>
            </div>
          </div>

          {/* HOW DOES IT WORK */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>What is tokenless?</strong>
            </div>
            <div className="panel-body">
              Tokenless is a prediction market...<br/><br/>
              Nostrud fugiat irure nisi sit voluptate pariatur magna tempor mollit incididunt id occaecat ex. Commodo non commodo officia consectetur esse sunt velit veniam consequat consequat exercitation adipisicing adipisicing. Ullamco aliqua culpa ad Lorem adipisicing. Consequat id velit exercitation velit est ullamco nulla id laborum consectetur labore incididunt. Id laborum aliquip sint eiusmod laboris consequat eiusmod pariatur aliqua irure minim nostrud. Tempor dolore amet consequat exercitation nostrud proident ullamco tempor Lorem occaecat. Culpa culpa do ipsum dolore. Eu tempor eu in proident dolor consequat veniam. Esse eiusmod pariatur veniam cupidatat tempor id. Ad adipisicing magna culpa mollit deserunt sint.
            </div>
          </div>

          {/* HOW TO PLAY  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>How to play?</strong>
            </div>
            <div className="panel-body">
              Nostrud fugiat irure nisi sit voluptate pariatur magna tempor mollit incididunt id occaecat ex. Commodo non commodo officia consectetur esse sunt velit veniam consequat consequat exercitation adipisicing adipisicing. Ullamco aliqua culpa ad Lorem adipisicing. Consequat id velit exercitation velit est ullamco nulla id laborum consectetur labore incididunt. Id laborum aliquip sint eiusmod laboris consequat eiusmod pariatur aliqua irure minim nostrud. Tempor dolore amet consequat exercitation nostrud proident ullamco tempor Lorem occaecat. Culpa culpa do ipsum dolore. Eu tempor eu in proident dolor consequat veniam. Esse eiusmod pariatur veniam cupidatat tempor id. Ad adipisicing magna culpa mollit deserunt sint.
              Nostrud fugiat irure nisi sit voluptate pariatur magna tempor mollit incididunt id occaecat ex. Commodo non commodo officia consectetur esse sunt velit veniam consequat consequat exercitation adipisicing adipisicing. Ullamco aliqua culpa ad Lorem adipisicing. Consequat id velit exercitation velit est ullamco nulla id laborum consectetur labore incididunt. Id laborum aliquip sint eiusmod laboris consequat eiusmod pariatur aliqua irure minim nostrud. Tempor dolore amet consequat exercitation nostrud proident ullamco tempor Lorem occaecat. Culpa culpa do ipsum dolore. Eu tempor eu in proident dolor consequat veniam. Esse eiusmod pariatur veniam cupidatat tempor id. Ad adipisicing magna culpa mollit deserunt sint.
            </div>
          </div>

          {/* LINK TO CREATE */}
          <div className="">
            <Link to="/list">
              <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>&nbsp;
              Browse Markets
            </Link>
            <br/>
            <br/>
          </div>

          {/* LATEST */}
          <div className="well">
            <div className="text-muted">
              -> todo: display latest or more popular markets...
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Home;
