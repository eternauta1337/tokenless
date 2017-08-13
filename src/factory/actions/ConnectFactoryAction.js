import TruffleContract from 'truffle-contract';
import FactoryArtifacts from '../../../build/contracts/MarketFactory.json';
import { MARKET_FACTORY_ADDRESS } from '../../constants';

export const CONNECT_FACTORY = 'factory/CONNECT_FACTORY';

export function connectFactory() {
  return async function(dispatch, getState) {
    console.log('connectFactory()');

    const factory = {};
    const web3 = getState().network.web3;

    // Retrieve factory.
    const Factory = TruffleContract(FactoryArtifacts);
    Factory.setProvider(web3.currentProvider);
    const contract = await Factory.at(MARKET_FACTORY_ADDRESS);
    factory.contract = contract;

    // Get factory info.
    factory.marketAddresses = await contract.getMarkets();

    dispatch({
      type: CONNECT_FACTORY,
      payload: factory
    });
  };
}
