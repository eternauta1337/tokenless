import Market from './MarketComponent';
import { connect } from 'react-redux';
import {
  connectMarket,
  // placeBetAsync,
  // resolveMarketASync,
  // withdrawPrizeAsync,
  // destroyMarketAsync
} from '../../actions/market';
// import store from '../../store';

const mapStateToProps = (state, ownProps) => {
  // console.log('MarketContainer - state', state);

  // const web3 = state.network.web3;
  // const market = state.markets.focusedMarket;

  // Retrieve and watch contract?
  // if(web3) {
  //   if(!market || market.address !== ownProps.routeParams.address) {
  //     store.dispatch(retrieveAndWatchMarketAt(ownProps.routeParams.address));
  //   }
  // }

  // TODO: stop watching contract when component dismounts

  return {
    activeAccount: state.network.activeAccount,
    isNetworkConnected: state.network.isConnected,
    isMarketConnected: state.market.isConnected
  };
  // return {
  //   isConnected: web3 && market,
  //   coinbase: web3 && web3.meta ? web3.meta.coinbase : undefined,
  //   nonce: state.markets.nonce,
  //   market
  // };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectMarket: (address) => dispatch(connectMarket(address))
  };
  // return {
  //   placeBetAsync: (prediction, value) => dispatch(placeBetAsync(prediction, value)),
  //   resolveMarketASync: (outcome) => dispatch(resolveMarketASync(outcome)),
  //   withdrawPrizeAsync: () => dispatch(withdrawPrizeAsync()),
  //   destroyMarketAsync: () => dispatch(destroyMarketAsync())
  // };
};

const MarketContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketContainer;
