import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';

export const CONNECT_MARKET = 'prediction/CONNECT';

export function connectMarket(address) {
  return async function(dispatch, getState) {
    console.log('connectMarket()', address);

    const prediction = {};
    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;

    // Retrieve prediction.
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const contract = await Market.at(address);
    prediction.contract = contract;

    // Extract prediction info.
    // console.log('getting prediction data... player:', player);
    prediction.playerPositiveBalance = +web3.fromWei(await contract.getUserBalance(true, {from: player}), 'ether').toNumber();
    prediction.playerNegativeBalance = +web3.fromWei(await contract.getUserBalance(false, {from: player}), 'ether').toNumber();
    prediction.statement = await contract.statement.call();
    prediction.positivePredicionBalance = +web3.fromWei(await contract.totals.call(true), 'ether').toNumber();
    prediction.negativePredicionBalance = +web3.fromWei(await contract.totals.call(false), 'ether').toNumber();
    prediction.owner = await contract.owner.call();
    prediction.predictionState = (await contract.getState()).toNumber();
    prediction.predictionStateStr = predictionStateToStr(prediction.predictionState);
    prediction.outcome = await contract.outcome.call();
    prediction.endBlock = (await contract.endBlock.call()).toNumber();
    prediction.killBlock = (await contract.killBlock.call()).toNumber();
    prediction.balance = web3util.getBalanceInEther(address, web3);
    if(prediction.predictionState === 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
    }
    // console.log('prediction: ', prediction);

    dispatch({
      type: CONNECT_MARKET,
      payload: prediction
    });
  };
}

function predictionStateToStr(state) {
  if(state === 0) return 'Open';
  if(state === 1) return 'Closed';
  if(state === 2) return 'Resolved';
  return 'Unknwon';
}
