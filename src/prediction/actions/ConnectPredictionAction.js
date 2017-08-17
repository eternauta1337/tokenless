import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';

export const CONNECT_MARKET = 'prediction/CONNECT';

export function connectPrediction(address) {
  return async function(dispatch, getState) {
    console.log('connectPrediction()', address);

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
    prediction.predictionStateStr = stateUtil.predictionStateToStr(prediction.predictionState);
    prediction.outcome = await contract.outcome.call();
    prediction.betEndDate = ( await contract.betEndTimestamp.call() ).toNumber();
    prediction.withdrawEndDate = ( await contract.withdrawEndTimestamp.call() ).toNumber();
    prediction.balance = await web3util.getBalanceInEther(address, web3);
    prediction.payments = +web3.fromWei(await contract.payments(player), 'ether').toNumber();
    if(prediction.predictionState === 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
    }
    console.log('prediction: ', prediction);

    dispatch({
      type: CONNECT_MARKET,
      payload: prediction
    });
  };
}