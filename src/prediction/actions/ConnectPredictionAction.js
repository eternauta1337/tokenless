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

    // Try to get cached info.
    let preview = getState().market.previews[address];
    if(preview) {
      prediction = { ...preview };
    }
    else {
      prediction.statement = await contract.statement.call();
    }

    // Basic update.
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    // ----------------------------------
    // Incremental updates below...
    // ----------------------------------

    prediction.predictionState = (await contract.getState()).toNumber();
    prediction.predictionStateStr = stateUtil.predictionStateToStr(prediction.predictionState);
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    prediction.balance = await web3util.getBalanceInEther(address, web3);
    prediction.positivePredicionBalance = +web3.fromWei(await contract.totals.call(true), 'ether').toNumber();
    prediction.negativePredicionBalance = +web3.fromWei(await contract.totals.call(false), 'ether').toNumber();
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    prediction.playerPositiveBalance = +web3.fromWei(await contract.getUserBalance(true, {from: player}), 'ether').toNumber();
    prediction.playerNegativeBalance = +web3.fromWei(await contract.getUserBalance(false, {from: player}), 'ether').toNumber();
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    prediction.betEndDate = ( await contract.betEndTimestamp.call() ).toNumber();
    prediction.withdrawEndDate = ( await contract.withdrawEndTimestamp.call() ).toNumber();
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    prediction.owner = await contract.owner.call();
    prediction.outcome = await contract.outcome.call();
    if(prediction.predictionState === 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
    }
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });
    // console.log('prediction: ', prediction);

    // Bet history.
    console.log('watch bets:');
    const currentBlock = getState().network.blockNumber;
    if(currentBlock) {
      let startBlock = currentBlock - 10000;
      if(startBlock < 0) startBlock = 0;
      const event = contract.BetEvent(
        {},
        {fromBlock:startBlock, toBlock: 'latest'}
      );
      event.get((err, res) => {
        if(!err) {
          console.log('res', res);
          if(!prediction.betHistory && res.length > 0) {
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
          type: CONNECT_PREDICTION,
          payload: prediction
        });
      });
    }

  };
}