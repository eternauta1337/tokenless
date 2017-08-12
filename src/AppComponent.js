import React, { Component } from 'react';
import { Link } from 'react-router';
import DebugComponent from './debug/components/DebugComponent';
import EthIconComponent from './common/components/EthIconComponent';
import {
  PATH_LIST,
  PATH_CREATE,
  PATH_ROOT,
  DEBUG_MODE
} from './constants';

class App extends Component {
  render() {
    const path = this.props.location.pathname;
    return (
      <div>

        {/* NAVIGATION */}
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">

            <div className="navbar-header">
              <Link className="navbar-brand" to={PATH_ROOT}>Tokenless</Link>
            </div>

            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">

                <li className={path === PATH_LIST ? 'active' : ''}>
                  <Link to="/list">Browse Markets</Link>
                </li>

                <li className={path === PATH_CREATE ? 'active' : ''}>
                  <Link to="/create">Create a Market</Link>
                </li>

              </ul>
            </div>
          </div>
        </nav>

        {/* BODY */}
        <div className="container">
          {this.props.children}
        </div>

        {/* DEBUG UI */}
        {DEBUG_MODE &&
          <DebugComponent/>
        }

      </div>
    );
  }
}

export default App;
