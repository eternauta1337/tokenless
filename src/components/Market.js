import React from 'react';

// TODO: remove
/*
  Test addresses:
  0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a
*/

class Market extends React.Component {

  render() {

    const {
      isConnected,
      market
    } = this.props;

    if(!isConnected) {
      return (
        <div>Connecting...</div>
      );
    }
    else {
      return (
        <div>
          <h1>{market.statement}</h1>
          <br/>
          <h2>Yea: 722 votes (3500 eth)</h2>
          <h2>Nay: 328 votes (250 eth)</h2>
          <h2>blocks remaining: {market.blocksRemaining}</h2>
          <br/>
          <h2>What is your prediction?</h2>
          <input placeholder='Please enter your bet'></input>
          <button>Yea</button>
          <button>Nay</button>
        </div>
      );
    }
  }
}

export default Market;
