import Market from './Market';
import { connect } from 'react-redux';
import {
  retrieveAndWatchMarketAt,
  placeBetAsync
} from '../../actions/MarketActions';
import store from '../../store';

const mapStateToProps = (state, ownProps) => {
  // console.log('MarketContainer - state', state);

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
    market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    placeBetAsync: (prediction, value) => dispatch(placeBetAsync(prediction, value))
  };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
