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
        <div className="container">

          {this.props.children}

          {/* DEBUG UI */}
          {DEBUG_MODE &&
            <DebugComponent/>
          }

        </div>

      </div>
    );
  }
}

export default App;
