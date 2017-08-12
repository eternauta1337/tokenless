export const RESET_MARKET = 'market/RESET';

export function resetMarket() {
  console.log('resetMarket()');
  return function(dispatch, getState) {
    dispatch({
      type: RESET_MARKET,
    });
  };
}
