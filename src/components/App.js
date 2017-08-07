import React, { Component } from 'react';
import { Link } from 'react-router';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/">Tokenless</Link>
          <Link to="/">Browse Markets</Link>
          <Link to="/">Create a Market</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default App;
