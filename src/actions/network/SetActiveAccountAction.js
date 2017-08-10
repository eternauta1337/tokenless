export const SET_ACTIVE_ACCOUNT_INDEX = 'network/SET_ACTIVE_ACCOUNT_INDEX';

export function setActiveAccountIndex(index) {
  return function(dispatch, getState) {
    dispatch({
      type: SET_ACTIVE_ACCOUNT_INDEX,
      payload: index
    });
  };
}
