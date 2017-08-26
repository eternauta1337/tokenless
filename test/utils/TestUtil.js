import colors from 'colors';

const verbose = 0;

export function log(...args) {
  if(verbose >= 0) {
    console.log(colors.gray('      ', ...args));
  }
}