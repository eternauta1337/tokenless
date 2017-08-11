import { push } from 'react-router-redux';

export function createMarket(statement, duration) {
  console.log('createMarket()', statement, duration);
  return async function(dispatch, getState) {

    const factory = getState().factory.factoryContract;

    console.log('creating market:', statement, duration);
    const creationTransaction = await factory.createMarket(
      statement,
      duration, {
        from: getState().network.activeAccountAddress,
        gas: 2000000
      }
    );

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const marketAddress = creationEventArgs.marketAddress;
    if(marketAddress) {
      console.log('market created at:', marketAddress);
      dispatch(push(`/market/${marketAddress}`));
    }
    else {
      // TODO: handle error
    }

  };
}
