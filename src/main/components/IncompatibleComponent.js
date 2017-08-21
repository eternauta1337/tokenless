import React from 'react';
import Delay from 'react-delay';
import {TARGET_LIVE_NETWORK} from "../../constants";

const IncompatibleComponent = ({
  isChrome,
  hasMetamask,
  loggedInWithMetamask,
  onProperNetwork
}) => {
  return (
    <div className="container">
      {/* Use a small delay to make sure the problems are not just temporary */}
      <Delay wait={1000}>
        <div className="jumbotron">

          <h1>
            Oops!
          </h1>
          <br/>

          {/* CHROME */}
          { !isChrome &&
          <div>
            <h3>This application needs to be ran on Google Chrome.</h3><br/>
            <h4><a href="https://www.google.com/chrome/browser/features.html">Get Chrome</a></h4>
          </div>
          }

          {/* METAMASK */}
          { !hasMetamask &&
          <div>
            <h3>This application requires the Metamask Google Chrome etension.</h3><br/>
            <h4><a href="https://metamask.io/">Get Metamask</a></h4>
          </div>
          }

          {/* METAMASK LOGIN */}
          { !loggedInWithMetamask &&
          <div>
            <h3>Please unlock your metamask wallet.</h3><br/>
          </div>
          }

          {/* NETWORK */}
          { !onProperNetwork &&
          <div>
            <h3>Please point Metamask to the {TARGET_LIVE_NETWORK} network.</h3>
          </div>
          }

        </div>
      </Delay>
    </div>
  );
};

export default IncompatibleComponent;