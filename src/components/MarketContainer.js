import Market from './Market';
import { connect } from 'react-redux';
import {
  fetchMarketAsync
} from '../actions/MarketActions';
import store from '../store';

const mapStateToProps = (state, ownProps) => {
  // console.log('MarketContainer - state', state);

  const web3 = state.network.web3;
  const market = state.markets[ownProps.routeParams.address];

  // Request market fetch?
  if(web3 && !market) {
    const { address } = ownProps.routeParams;
    store.dispatch(fetchMarketAsync(address));
  }

  return {
    isConnected: web3 && market,
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
