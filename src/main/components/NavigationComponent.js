import React from 'react';
import { Link } from 'react-router';
import EthIconComponent from '../../common/components/EthIconComponent';
import {
  PATH_LIST,
  PATH_CREATE,
  PATH_ROOT,
  PATH_ABOUT
} from '../../constants';

const NavigationComponent = ({ path }) => {
  return (
    <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">

          {/* BRAND */}
          <div className="navbar-header">
            <Link className="navbar-brand" to={PATH_ROOT}>
              <div className="brand">
                <EthIconComponent/>
                <span>Tokenless</span>
              </div>
            </Link>
          </div>

          {/* NAV ITEMS */}
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">

              {/* MARKET LIST */}
              <li className={`${path === PATH_LIST ? 'active' : ''}`}>
                <Link to={PATH_LIST}>Browse Markets</Link>
              </li>

              {/* CREATE MARKET */}
              <li className={path === PATH_CREATE ? 'active' : ''}>
                <Link to={PATH_CREATE}>Create a Market</Link>
              </li>

              {/* ABOUT */}
              <li className={path === PATH_ABOUT ? 'active' : ''}>
                <Link to={PATH_ABOUT}>About</Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default NavigationComponent;
