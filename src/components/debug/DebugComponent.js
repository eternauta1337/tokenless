import React from 'react';

class Debug extends React.Component {
  render() {
    const {
      accounts,
      setActiveAccountIndex
     } = this.props;
    return (
      <div className='debugPanel'>
        <h3>Debug Panel</h3>
        <form>
          <label>Active account:&nbsp;</label>
          <select
            onChange={(event) => setActiveAccountIndex(event.target.value)}
            defaultValue={0}>
            >
            {accounts && accounts.map((account, index) => {
              return <option value={index} key={index}>account {index}: {account}</option>;
            })}
          </select>
        </form>
      </div>
    );
  }
}

export default Debug;
