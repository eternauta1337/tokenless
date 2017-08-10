import React, { Component } from 'react';
import { Link } from 'react-router';
import DebugContainer from './debug/DebugContainer';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/">Home</Link>&nbsp;
          <Link to="/">Browse Markets</Link>&nbsp;
          <Link to="/">Create a Market</Link>&nbsp;
        </nav>
        <br/>
        {this.props.children}
        <br/>
        <DebugContainer/>
      </div>
    );
  }
}

export default App;
