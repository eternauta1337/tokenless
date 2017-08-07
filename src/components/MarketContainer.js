import Market from './Market';
import { connect } from 'react-redux';
import {
  fetchMarketAsync
} from '../actions/MarketActions';

const mapStateToProps = (state, ownProps) => {
  console.log('MarketContainer - state', state);
  const web3 = state.network.web3;
  const market = state.markets[ownProps.routeParams.address];
  return {
    isWeb3Connected: web3 !== undefined,
    isMarketConnected: market !== undefined,
    market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMarketAsync: (address) => dispatch(fetchMarketAsync(address))
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
