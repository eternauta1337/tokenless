import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveAccountIndex
} from '../../network/actions';

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

const mapStateToProps = (state, ownProps) => {
  // console.log('DebugContainer - state', state);
  const web3 = state.network.web3;
  return {
    accounts: web3 ? web3.eth.accounts : []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveAccountIndex: (index) => dispatch(setActiveAccountIndex(index))
  };
};

const DebugContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Debug);

export default DebugContainer;
