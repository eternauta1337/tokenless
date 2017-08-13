export const MARKET_FORGOTTEN = 'factory/MARKET_FORGOTTEN';

export function forgetMarket(address) {
  console.log('forgetMarket()', address);
  return async function(dispatch, getState) {

    const factory = getState().factory.contract;

    console.log('forgetting market:', address);
    const transaction = await factory.forgetMarket(
      address, {
        from: getState().network.activeAccountAddress
      }
    );

    // Market address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const eventArgs = transaction.logs[0].args;
    const marketAddress = eventArgs.marketAddress;
    if(marketAddress) {
      console.log('market forgotten at:', marketAddress);
      dispatch({
        type: MARKET_FORGOTTEN,
        payload: marketAddress
      });
    }
    else {
      // TODO: handle error
    }
  };
}
