import React, { Component } from 'react';
import NavigationComponent from './NavigationComponent';
import DebugComponent from '../../debug/components/DebugComponent';
import {
  DEBUG_MODE
} from '../../constants';

class App extends Component {
  render() {
    return (
      <div className="">

        {/* NAV */}
        <NavigationComponent path={this.props.location.pathname}/>

        {/* BODY */}
        <div className="wrapper">
          {/* CONTENT MANAGED BY ROUTES */}
          {this.props.children}
        </div>

        {/* FOOTER */}
        <footer className="row footer-muted">
          <div className="text-center">
            <small className="text-muted">
              Created with <span className="glyphicon glyphicon-flash" aria-hidden="true"></span>&nbsp; by the Zeppelin team
            </small>
          </div>
        </footer>

        {/* DEBUG UI */}
        <footer className="footer navbar-fixed-bottom">
          {DEBUG_MODE &&
            <DebugComponent/>
          }
        </footer>

      </div>
    );
  }
}

export default App;
