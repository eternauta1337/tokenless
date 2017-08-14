import React from 'react';
import { Link } from 'react-router';
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
                <span className='icon'>
                  <svg width="14" height="14" viewBox="0 2 24 24">
                    <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z"></path>
                  </svg>
                </span>
                <span>tokenless.pm</span>
              </div>
            </Link>
          </div>

          {/* NAV ITEMS */}
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">

              {/* MARKET LIST */}
              <li className={`${path === PATH_LIST ? 'active' : ''}`}>
                <Link to={PATH_LIST}>Browse Predictions</Link>
              </li>

              {/* CREATE MARKET */}
              <li className={path === PATH_CREATE ? 'active' : ''}>
                <Link to={PATH_CREATE}>Create a Prediction</Link>
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
