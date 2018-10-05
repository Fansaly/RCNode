import React from 'react';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {
  navTabsArray as navTabs,
  navIsActive,
} from '../../common';
import './nav.styl';

class Nav extends React.Component {
  navIsActive = (path) => (match, location) => {
    return navIsActive(path, location);
  };

  render() {
    return (
      <Grid
        container
        spacing={0}
        justify={'center'}
        alignItems={'center'}
        className="type-content"
      >
        {navTabs.map(({path, name}) => (
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

export default Nav;
