import Market from './Market';
import { connect } from 'react-redux';
import {
  retrieveAndWatchMarketAt
} from '../actions/MarketActions';
import store from '../store';

const mapStateToProps = (state, ownProps) => {
  // console.log('MarketContainer - state', state);

  const web3 = state.network.web3;
  const focusedMarketAddress = state.markets.focusedMarketAddress;
  const urlMarketAddress = ownProps.routeParams.address;
  const market = state.markets[urlMarketAddress];

  // Retrieve and watch contract?
  if(web3 && focusedMarketAddress !== urlMarketAddress) {
    const { address } = ownProps.routeParams;
    store.dispatch(retrieveAndWatchMarketAt(address));
  }

  return {
    isConnected: web3 && market,
    coinbase: state.network.coinbase,
    market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
