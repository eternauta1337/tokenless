import React, { Component } from 'react';
import NavigationComponent from './NavigationComponent';
import DebugComponent from '../../debug/components/DebugComponent';
import {
  DEBUG_MODE
} from '../../constants';

class App extends Component {
  render() {
    return (
      <div>

        {/* NAV */}
        <NavigationComponent path={this.props.location.pathname}/>

        {/* BODY */}
        <div className="">
          {/* CONTENT MANAGED BY ROUTES */}
          {this.props.children}
        </div>

        {/* FOOTER */}
        <footer className="footer navbar-fixed-bottom">
          <div className="row">
            <div className="text-center">
              <small className="text-muted">
                Created with <span className="glyphicon glyphicon-heart" aria-hidden="true"></span>&nbsp; by the Zeppelin team
              </small>
            </div>
            {/* DEBUG UI */}
            {DEBUG_MODE &&
              <DebugComponent/>
            }
          </div>
        </footer>

      </div>
    );
  }
}

export default App;
