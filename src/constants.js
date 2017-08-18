// General.
export const DEBUG_MODE = true; // activates a debug panel useful for development
export const USE_INJECTED_WEB3 = true; // for use with eg. metamask
export const TARGET_LIVE_NETWORK = 'ropsten'; // ropsten, mainnet, testrpc

// Market contract urls.
export const MARKET_ADDRESS_TESTRPC =
  '0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a';
export const MARKET_ADDRESS_ROPSTEN =
  '0x6C12aF0d66552f5379D626D921755203686767b5';
export const MARKET_ADDRESS_MAINNET =
  '';

// Block explorer urls.
export const EXPLORER_URL = {
  testrpc: 'http://localhost:8000/#/', // requires: geth --rpc --rpccorsdomain "http://localhost:8000"
  ropsten: 'https://ropsten.etherscan.io/',
  mainnet: 'https://etherscan.io/'
};

// Router paths.
const baseURL = '';
export const PATH_CREATE = baseURL + '/create';
export const PATH_PREDICTION = baseURL + '/prediction/:address';
export const PATH_ROOT = baseURL + '/';
export const PATH_ABOUT = baseURL + '/about';
