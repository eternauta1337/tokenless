export const RESET_MARKET = 'prediction/RESET';

export function resetMarket() {
  console.log('resetMarket()');
  return function(dispatch, getState) {
    dispatch({
      type: RESET_MARKET,
    });
  };
}
