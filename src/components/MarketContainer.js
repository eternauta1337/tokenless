import Market from './Market';
import { connect } from 'react-redux';
import {
  fetchMarketAsync
} from '../actions/MarketActions';

const mapStateToProps = (state, ownProps) => {
  const web3 = state.web3.instance;
  const market = state.markets[ownProps.routeParams.address];
  return {
    isWeb3Connected: web3 !== null,
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
