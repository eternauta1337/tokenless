import React from 'react';
import { connect } from 'react-redux';
import * as web3Util from '../../utils/Web3Util';
import {
  setActiveAccountIndex
} from '../../network/actions';

class Debug extends React.Component {

  constructor() {
    super();

    this.state = {
      accountBalance: '',
      accountIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.accounts.length > 0 && this.props.globalState.network.web3) {
      this.updateBalance();
    }
  }

  updateBalance() {
    const address = this.props.accounts[this.state.accountIndex];
    const balance = web3Util.getBalanceInEther(address, this.props.globalState.network.web3);
    this.setState({
      accountBalance: balance
    });
  }

  onAccountSelected(index) {
    this.setState({
      accountIndex: index
    });
    this.props.setActiveAccountIndex(index);
    this.updateBalance();
  }

  render() {
    return (
      <div className='debugPanel'>
        <select
          onChange={(event) => this.onAccountSelected(event.target.value)}
          defaultValue={0}>
          >
          {this.props.accounts && this.props.accounts.map((account, index) => {
            return <option value={index} key={index}>account {index}: {account}</option>;
          })}
        </select>
        &nbsp;{this.state.accountBalance} ETH
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('DebugContainer - state', state);
  const web3 = state.network.web3;
  return {
    globalState: state,
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
