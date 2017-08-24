import TruffleContract from 'truffle-contract';
import PredictionArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';
import {STORAGE_PREDICTION_KEY, USE_CACHE} from "../../constants";
import { push } from 'react-router-redux';
import _ from 'lodash';

export const CONNECT_PREDICTION = 'prediction/CONNECT';
export const UPDATE_PREDICTION = 'prediction/UPDATE_PREDICTION';

// ----------------------------------
// Basic Connection
// ----------------------------------

export function connectPrediction(address) {
  return async function(dispatch, getState) {

    console.log('connectPrediction()', address);

    const web3 = getState().network.web3;

    // Try to retrieve from cache.
    const cached = retrieveCachedPrediction(address);
    // console.log('cached:', cached);

    // Extract basic prediction info.
    let prediction = cached ? cached : {};
    prediction.address = address;
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    // Retrieve prediction contract.
    const Prediction = TruffleContract(PredictionArtifacts);
    Prediction.setProvider(web3.currentProvider);
    try {
      const contract = await Prediction.at(address);
      console.log('connected to prediction');

      prediction.contract = contract;
      if (!checkContinue(address, getState)) return;
      cachePrediction(address, prediction);
      dispatch({
        type: UPDATE_PREDICTION,
        payload: prediction
      });

      // Update static data.
      dispatch(updatePredictionStatement(address));
      dispatch(updatePredictionOwner(address));
      dispatch(updatePredictionDates(address));

      // Update dynamic data.
        dispatch(updateDynamicPredictionData(address));
    }
    catch(err) {
      console.log('error connecting prediction:', err);

      // Redirect to 404.
      dispatch(push(`/404`));
    }
  };
}

// ----------------------------------
// Static Data
// ----------------------------------

export function updatePredictionOwner(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    if(prediction.owner) return;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;
    console.log('get owner');
    prediction.owner = await contract.owner.call();
    if (!checkContinue(address, getState)) return;
    if (prediction.predictionState === 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
    }
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionDates(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    if(prediction.betEndDate && prediction.withdrawEndDate) return;
    const contract = getState().prediction.contract;
    console.log('get dates');
    prediction.betEndDate = ( await contract.betEndTimestamp.call() ).toNumber();
    if (!checkContinue(address, getState)) return;
    prediction.withdrawEndDate = ( await contract.withdrawEndTimestamp.call() ).toNumber();
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionStatement(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    if(prediction.statement) return;
    const contract = getState().prediction.contract;
    prediction.statement = await contract.statement.call();
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });
  };
}

// ----------------------------------
// Dynamic Data
// ----------------------------------

export function updateDynamicPredictionData(address) {
  console.log('updateDynamicPredictionData()');
  return async function(dispatch) {
    dispatch(updatePredictionState(address));
    dispatch(updatePredictionBalances(address));
    dispatch(updatePredictionPlayerBalances(address));
    dispatch(updatePredictionBetHistory(address));
  };
}

export function updatePredictionPlayerBalances(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;
    console.log('get player balances');
    prediction.playerPositiveBalance = +web3.fromWei(await contract.getUserBalance(true, {from: player}), 'ether').toNumber();
    if (!checkContinue(address, getState)) return;
    prediction.playerNegativeBalance = +web3.fromWei(await contract.getUserBalance(false, {from: player}), 'ether').toNumber();
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionBalances(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    console.log('get balances');
    prediction.balance = await web3util.getBalanceInEther(address, web3);
    if (!checkContinue(address, getState)) return;
    const preview = getState().market.previews[address];
    if(preview) preview.balance = prediction.balance;
    prediction.positivePredicionBalance = +web3.fromWei(await contract.totals.call(true), 'ether').toNumber();
    if (!checkContinue(address, getState)) return;
    prediction.negativePredicionBalance = +web3.fromWei(await contract.totals.call(false), 'ether').toNumber();
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionState(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    console.log('get state');
    prediction.outcome = await contract.outcome.call();
    if (!checkContinue(address, getState)) return;
    prediction.predictionState = (await contract.getState()).toNumber();
    if (!checkContinue(address, getState)) return;
    prediction.predictionStateStr = stateUtil.predictionStateToStr(prediction.predictionState);
    const preview = getState().market.previews[address];
    if(preview) preview.predictionState = prediction.predictionState;
    if(preview) preview.predictionStateStr = prediction.predictionStateStr;
    if (!checkContinue(address, getState)) return;
    cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionBetHistory(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    if (prediction.balance > 0) {
      // console.log('get bet history');
      const currentBlock = getState().network.blockNumber;
      if (!checkContinue(address, getState)) return;
      if (currentBlock) {
        const startBlock = Math.max(currentBlock - 4000, 0);
        const event = contract.BetEvent({}, {fromBlock: startBlock, toBlock: 'latest'});
        event.get((err, res) => {
          if (!checkContinue(address, getState)) return;
          if (!err) {
            // console.log('res', res);
            if (!prediction.betHistory) {
              // console.log('start bet history');
              prediction.betHistory = [];
            }
            for (let i = 0; i < res.length; i++) {
              // console.log('update bet history item');
              const item = res[i];
              const data = item.args;
              prediction.betHistory.splice(0, 0, {
                tx: item.transactionHash,
                from: data.from,
                prediction: data.prediction,
                value: +web3.fromWei(data.value, 'ether').toNumber()
              });
            }
            cachePrediction(address, prediction);
          }
          else {
            console.log('err', err);
          }
          dispatch({
            type: UPDATE_PREDICTION,
            payload: prediction
          });
        });
      }
    }
  };
}

// ----------------------------------
// Utils
// ----------------------------------

function retrieveCachedPrediction(address) {
  const cachedRaw = window.localStorage[STORAGE_PREDICTION_KEY + address];
  return cachedRaw ? JSON.parse(cachedRaw) : null;
}

function cachePrediction(address, prediction) {
  if(!USE_CACHE) return;
  const toCache = _.omit(prediction, 'contract');
  window.localStorage[STORAGE_PREDICTION_KEY + address] = JSON.stringify(toCache);
}

// Check if the app is no longer poiting to this prediction after
// async callbacks.
function checkContinue(address, getState) {
  // console.log('checkContinue()');
  let cont = false;
  const targetAddress = getState().prediction.targetPredictionAddress;
  if(!cont && !address) cont = true;
  if(!cont && !targetAddress) cont = true;
  if(!cont && targetAddress === address) cont = true;
  // console.log('cont', cont);
  return cont;
}