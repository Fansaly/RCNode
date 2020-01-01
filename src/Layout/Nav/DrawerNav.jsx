import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import {
  navTabsArray as navTabs,
  navIsActive,
} from '../../common';

import { makeStyles } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import TopicTypeIcon from '../../Components/TopicTypeIcon';
import Logo from '../../Components/Logo';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 214,
    backgroundColor: theme.palette.type === 'light' ? 'rgba(255,255,255,.96)' : 'rgba(66,66,66,.98)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...theme.mixins.toolbar,
  },
  logo: {
    paddingLeft: 16,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 24,
    },
    '& svg': {
      height: 32,
      marginBottom: 2,
    },
  },
  spacing: {
    marginRight: 6,
  },
}));

const DrawerNav = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const isActive = path => {
    return navIsActive(path, location);
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleClick = path => {
    history.push(path);
    handleClose();
  };

  return (
    <SwipeableDrawer
      open={props.open}
      variant="temporary"
      onClose={handleClose}
      onOpen={()=>{}}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <div className={`${classes.toolbar} ${classes.logo}`}>
        <Logo reverse />
      </div>

      <List>
        {navTabs.map(({ tab, path, name }) => (
          <ListItem
            button
            key={tab}
            component="a"
            selected={isActive(path)}
            onClick={event => handleClick(path)}
          >
            <ListItemIcon className={classes.spacing}>
              <TopicTypeIcon
                color="inherit"
                all={tab === 'all'}
                good={tab === 'good'}
                tab={tab}
              />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
};

DrawerNav.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DrawerNav;
