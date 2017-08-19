import React from 'react';
import _ from 'lodash';
import BubblePreloader from 'react-bubble-preloader';
import {EXPLORER_URL, TARGET_LIVE_NETWORK} from "../../constants";

const HistoryComponent = ({
                            player,
                            betHistory
                          }) => {

  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Recent bets</strong>
      </div>
      <div className="panel-body">

        {/* LOADING HISTORY */}
        {!betHistory &&
          <BubblePreloader
            bubble={{ width: '1rem', height: '1rem' }}
            animation={{ speed: 2 }}
            className=""
            colors={['#ffbb33', '#FF8800', '#ff4444']}
          />
        }

        {/* NO HISTORY */}
        {betHistory && betHistory.length === 0 &&
          <span>No Recent History</span>
        }

        {/* SHOW HISTORY */}
        {betHistory && betHistory.length > 0 &&
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
            return (
              <tr
                className={isSelf ? 'info' : 'default'}
                key={item.tx}
              >
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
        }
      </div>
    </div>
  );
};

export default HistoryComponent;