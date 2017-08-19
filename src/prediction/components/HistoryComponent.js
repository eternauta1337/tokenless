import React from 'react';
import _ from 'lodash';
import {EXPLORER_URL, TARGET_LIVE_NETWORK} from "../../constants";

const HistoryComponent = ({
  player,
  betHistory
}) => {

  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Bet history</strong>
      </div>
      <div className="panel-body">
        <table className="table table-striped table-hover">

          {/* TABLE HEADER */}
          <thead>
            <tr>
              <th>From/Tx</th>
              <th>Bet</th>
              <th>Value</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {_.map(betHistory, (item) => {
              const isSelf = item.from === player;
              console.log('isSelf', isSelf);
              console.log(item.from, player);
              return (
                <tr className={isSelf ? 'info' : 'default'}>
                  <td>

                    {/* SENDER */}
                    <small>
                      {item.from}
                    </small>
                    <br/>

                    {/* TX */}
                    <small>
                      <a href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}tx/${item.tx}`}>
                        {item.tx}
                      </a>
                    </small>
                  </td>

                  {/* YES/NO */}
                  <td>{item.prediction === true ? 'yes' : 'no'}</td>

                  {/* ETH */}
                  <td>{item.value} eth</td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default HistoryComponent;