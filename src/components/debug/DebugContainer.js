import Debug from './DebugComponent';
import { connect } from 'react-redux';
import {
  setActiveAccountIndex
} from '../../actions/network';

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
