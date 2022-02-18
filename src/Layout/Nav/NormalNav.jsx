import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  navTabsArray as navTabs,
  navIsActive,
} from '../../common';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './normal-nav.styl';

const useStyles = makeStyles(theme => ({
  root: {
    '& .type': {
      color: `${theme.palette.type === 'light' ? '#fff' : '#ccc'} !important`,
    },
  },
}));

const NormalNav = () => {
  const classes = useStyles();

  const isActive = path => (match, location) => {
    return navIsActive(path, location);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className="type-content"
    >
      {navTabs.map(({ path, name }) => (
        <NavLink
          to={path}
          key={path}
          activeClassName={`${classes.root} current`}
          isActive={isActive(path)}
        >
          <Button
            className="type"
            disableFocusRipple
          >
            {name}
          </Button>
        </NavLink>
      ))}
    </Grid>
  );
};

export default NormalNav;
