import React from 'react';
import { connect } from 'react-redux';
import * as web3Util from '../../utils/Web3Util';
import {
  setActiveAccountIndex
} from '../../network/actions';
import {
  USE_INJECTED_WEB3
} from "../../constants";
import * as web3util from '../../utils/Web3Util';
import * as dateUtil from '../../utils/DateUtil';

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

  async updateBalance() {
    const address = this.props.accounts[this.state.accountIndex];
    const balance = await web3Util.getBalanceInEther(address, this.props.globalState.network.web3);
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

    const nowTimestamp = dateUtil.dateToUnix(new Date());
    const bcTimestamp = this.props.globalState.network.currentTime;
    const nowStr = dateUtil.unixToStr(bcTimestamp);
    const isDetached = Math.abs(nowTimestamp - bcTimestamp) > 2 * 60;
    // console.log('timestamp detach:', Math.abs(nowTimestamp - bcTimestamp));

    return (
      <div className='debugPanel'>

        {/* ACCOUNT SELECTOR */}
        { !USE_INJECTED_WEB3 &&
          <select className=""
                  onChange={(event) => this.onAccountSelected(event.target.value)}
                  defaultValue={0}>
            {this.props.accounts && this.props.accounts.map((account, index) => {
              return <option value={index} key={index}>ACCT {index}: {account}</option>;
            })}
          </select>
        }

        {/* ACCOUNT BALANCE */}
        &nbsp;
        <small>
          {this.props.globalState.network.activeAccountAddress}&nbsp;|&nbsp;
          {this.state.accountBalance}&nbsp;
        </small>
        <br/>

        {/* SKIP */}
        &nbsp;[
        {/* BLOCKCHAIN TIMESTAMP */}
        { bcTimestamp &&
          <span className={`text-${isDetached ? 'danger' : 'default'}`}>{nowStr}</span>
        }
        <button onClick={() => {
          const secs = 60;
          web3util.skipTime(secs, this.props.globalState.network.web3);
        }}>+1m</button>
        <button onClick={() => {
          const secs = 10 * 60;
          web3util.skipTime(secs, this.props.globalState.network.web3);
        }}>+10m</button>
        <button onClick={() => {
          const secs = 60 * 60;
          web3util.skipTime(secs, this.props.globalState.network.web3);
        }}>+1h</button>
        <button onClick={() => {
          const secs = 10 * 60 * 60;
          web3util.skipTime(secs, this.props.globalState.network.web3);
        }}>+10h</button>
        <button onClick={() => {
          const secs = dateUtil.daysToSeconds(1);
          web3util.skipTime(secs, this.props.globalState.network.web3);
        }}>+1d</button>
        <button onClick={() => {
          const secs = dateUtil.daysToSeconds(10);
          web3util.skipTime(secs, this.props.globalState.network.web3);
          }}>+10d</button>
        ]&nbsp;

        {/* SEND DUMMY TRANSACTION */}
        <button onClick={(evt) => {
          web3util.sendDummyTransaction(
            this.props.globalState.network.web3,
            this.props.globalState.network.activeAccountAddress
          );
        }}>DUMMY Tx</button>&nbsp;

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
