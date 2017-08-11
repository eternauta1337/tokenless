import React, { Component } from 'react';
import { Link } from 'react-router';
import DebugComponent from '../debug/components/DebugComponent';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/">Home</Link>&nbsp;
          <Link to="/list">Browse Markets</Link>&nbsp;
          <Link to="/create">Create a Market</Link>&nbsp;
        </nav>
        <br/>
        {this.props.children}
        <br/>
        <DebugComponent/>
      </div>
    );
  }
}

export default App;
