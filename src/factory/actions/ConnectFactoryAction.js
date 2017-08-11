import TruffleContract from 'truffle-contract';
import FactoryArtifacts from '../../../build/contracts/MarketFactory.json';

export const CONNECT_FACTORY = 'factory/CONNECT_FACTORY';

export function connectFactory() {
  return async function(dispatch, getState) {
    console.log('connectFactory()');

    const web3 = getState().network.web3;

    // Retrieve factory.
    const Factory = TruffleContract(FactoryArtifacts);
    Factory.setProvider(web3.currentProvider);
    const contract = await Factory.at('0xeb5785c94a8b2b6302764a4d6db8463337fd7bc6');

    dispatch({
      type: CONNECT_FACTORY,
      payload: contract
    });
  };
}
