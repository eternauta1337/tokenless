import Market from './Market';
import { connect } from 'react-redux';
import {
  retrieveAndWatchMarketAt,
  placeBetAsync,
  resolveMarketASync,
  withdrawPrizeAsync
} from '../../actions/market/MarketActions';
import store from '../../store';

const mapStateToProps = (state, ownProps) => {
  console.log('MarketContainer - state', state);

  const web3 = state.network.web3;
  const market = state.markets.focusedMarket;

  // Retrieve and watch contract?
  if(web3) {
    if(!market || market.address !== ownProps.routeParams.address) {
      store.dispatch(retrieveAndWatchMarketAt(ownProps.routeParams.address));
    }
  }

  // TODO: stop watching contract when component dismounts

  return {
    isConnected: web3 && market,
    coinbase: state.network.coinbase,
    nonce: state.markets.nonce,
    market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    placeBetAsync: (prediction, value) => dispatch(placeBetAsync(prediction, value)),
    resolveMarketASync: (outcome) => dispatch(resolveMarketASync(outcome)),
    withdrawPrizeAsync: (outcome) => dispatch(withdrawPrizeAsync())
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
