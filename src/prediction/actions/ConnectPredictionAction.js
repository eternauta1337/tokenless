import TruffleContract from 'truffle-contract';
import MarketArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';

export const CONNECT_PREDICTION = 'prediction/CONNECT';
export const UPDATE_PREDICTION = 'prediction/UPDATE_PREDICTION';

export function connectPrediction(address) {
  return async function(dispatch, getState) {

    console.log('connectPrediction()', address);

    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;

    // Retrieve prediction.
    const Market = TruffleContract(MarketArtifacts);
    Market.setProvider(web3.currentProvider);
    const contract = await Market.at(address);

    // Extract prediction info.
    let prediction = {};
    prediction.address = address;
    prediction.contract = contract;

    // Try to reuse preview data.
    console.log('get basic data');
    const preview = getState().market.previews[address];
    if(preview && preview.statement) prediction.statement = preview.statement;
    else prediction.statement = await contract.statement.call();
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    // ----------------------------------
    // Incremental updates below...
    // ----------------------------------

    console.log('get state');
    prediction.outcome = await contract.outcome.call();
    prediction.predictionState = (await contract.getState()).toNumber();
    prediction.predictionStateStr = stateUtil.predictionStateToStr(prediction.predictionState);
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });

    console.log('get balances');
    prediction.balance = await web3util.getBalanceInEther(address, web3);
    prediction.positivePredicionBalance = +web3.fromWei(await contract.totals.call(true), 'ether').toNumber();
    prediction.negativePredicionBalance = +web3.fromWei(await contract.totals.call(false), 'ether').toNumber();
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });

    console.log('get owner');
    prediction.owner = await contract.owner.call();
    if(prediction.predictionState === 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
    }
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });

    console.log('get dates');
    prediction.betEndDate = ( await contract.betEndTimestamp.call() ).toNumber();
    prediction.withdrawEndDate = ( await contract.withdrawEndTimestamp.call() ).toNumber();
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });

    console.log('get player balances');
    prediction.playerPositiveBalance = +web3.fromWei(await contract.getUserBalance(true, {from: player}), 'ether').toNumber();
    prediction.playerNegativeBalance = +web3.fromWei(await contract.getUserBalance(false, {from: player}), 'ether').toNumber();
    if(!checkContinue(address, getState)) return;
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });

    // Bet history.
    if(prediction.balance > 0) {
      console.log('get bet history:');
      const currentBlock = getState().network.blockNumber;
      if(!checkContinue(address, getState)) return;
      if(currentBlock) {
        const startBlock = Math.max(currentBlock - 4000, 0);
        const event = contract.BetEvent( {}, {fromBlock:startBlock, toBlock: 'latest'} );
        event.get((err, res) => {
          if(!checkContinue(address, getState)) return;
          if(!err) {
            console.log('res', res);
            if(!prediction.betHistory) {
              prediction.betHistory = [];
            }
            for(let i = 0; i < res.length; i++) {
              const item = res[i];
              const data = item.args;
              prediction.betHistory.splice(0, 0, {
                tx: item.transactionHash,
                from: data.from,
                prediction: data.prediction,
                value: +web3.fromWei(data.value, 'ether').toNumber()
              });
            }
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

function checkContinue(address, getState) {
  // console.log('checkContinue()');
  let cont = false;
  const targetAddress = getState().prediction.targetPredictionAddress;
  if(!cont && !address) cont = true;
  if(!cont && !targetAddress) cont = true;
  if(!cont && targetAddress === address) cont = true;
  console.log('cont', cont);
  return cont;
}