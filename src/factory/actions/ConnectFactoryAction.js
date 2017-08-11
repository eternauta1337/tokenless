import TruffleContract from 'truffle-contract';
import FactoryArtifacts from '../../../build/contracts/MarketFactory.json';

export const CONNECT_FACTORY = 'factory/CONNECT_FACTORY';

export function connectFactory() {
  return async function(dispatch, getState) {
    console.log('connectFactory()');

    const factory = {};
    const web3 = getState().network.web3;

    // Retrieve factory.
    const Factory = TruffleContract(FactoryArtifacts);
    Factory.setProvider(web3.currentProvider);
    const ADDRESS = '0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a';
    const contract = await Factory.at(ADDRESS);
    factory.contract = contract;

    // Get factory info.
    factory.markets = await contract.getMarkets();

    dispatch({
      type: CONNECT_FACTORY,
      payload: factory
    });
  };
}
