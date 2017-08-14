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
              <div className="brand">
                <span className='icon'>
                  <svg width="44" height="44" viewBox="0 2 24 24">
                    <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z"></path>
                  </svg>
                </span>
                <h1>tokenless.pm</h1>
              </div>
              <p>A tokenless prediction market. No tokens, just ether.</p>
            </div>
          </div>

          {/* HOW DOES IT WORK */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>What is tokenless.pm?</strong>
            </div>
            <div className="panel-body">
              Tokenless is a prediction prediction...<br/><br/>
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
              Browse Predictions
            </Link>
            <br/>
            <br/>
          </div>

          {/* LATEST */}
          <div className="well">
            <div className="text-muted">
              -> todo: display latest or more popular predictions...
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Home;
