import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  navTabsArray as navTabs,
  navIsActive,
} from '../../common';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './normal-nav.styl';

class NormalNav extends React.Component {
  navIsActive = path => (match, location) => {
    return navIsActive(path, location);
  };

  render() {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        className="type-content"
      >
        {navTabs.map(({ path, name }) => (
          <NavLink
            to={path}
            key={path}
            activeClassName="current"
            isActive={this.navIsActive(path)}
          >
            <Button disableFocusRipple className="type">
              {name}
            </Button>
          </NavLink>
        ))}
      </Grid>
    );
  }
}

export default NormalNav;
