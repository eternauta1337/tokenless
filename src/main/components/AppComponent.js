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
        <footer className="row footer-muted" style={{height: DEBUG_MODE ? '95px' : '30px'}}>
          <div className="text-center">
            <small className="text-muted">
              <span className="glyphicon glyphicon-flash" aria-hidden="true"></span>
              Powered by OpenZeppelin
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
