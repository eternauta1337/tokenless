import {STORAGE_PREVIEW_KEY} from "../../constants";

export const FORGET_PREVIEW = 'prediction/FORGET_PREVIEW';

export function forgetPreview(address) {
  console.log('forgetPreview()', address);
  return async function(dispatch, getState) {

    // Delete cache.
    console.log('remove from cache');
    window.localStorage.removeItem(STORAGE_PREVIEW_KEY + address);

    dispatch({
      type: FORGET_PREVIEW,
      payload: address
    });
  };
}
