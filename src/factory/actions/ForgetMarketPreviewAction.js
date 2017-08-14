export const FORGET_PREVIEW = 'factory/FORGET_PREVIEW';

export function forgetPreview(address) {
  console.log('forgetPreview()', address);
  return async function(dispatch, getState) {
    dispatch({
      type: FORGET_PREVIEW,
      payload: address
    });
  };
}
