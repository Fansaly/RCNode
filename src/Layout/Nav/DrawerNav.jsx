import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  navTabsArray as navTabs,
  navIsActive,
} from '../../common';

import { withStyles } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import TopicTypeIcon from '../../Components/TopicTypeIcon';
import LogoSvg from '../../static/cnodejs/cnodejs.svg';

const styles = theme => ({
  drawerPaper: {
    width: 214,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
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
});

class DrawerNav extends React.Component {
  navIsActive = path => {
    return navIsActive(path, this.props.location);
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleClick = path => {
    const { history } = this.props;

    history.push(path);
    this.handleClose();
  };

  render() {
    const { classes, open } = this.props;

    return (
      <SwipeableDrawer
        open={open}
        variant="temporary"
        onClose={this.handleClose}
        onOpen={()=>{}}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className={classNames(classes.toolbar, classes.logo)}>
          <LogoSvg />
        </div>

        <Divider />

        <List>
          {navTabs.map(({ tab, path, name }) => (
            <ListItem
              button
              key={tab}
              component="a"
              selected={this.navIsActive(path)}
              onClick={event => this.handleClick(path)}
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

        <Divider />

      </SwipeableDrawer>
    );
  }
}

DrawerNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withRouter,
)(DrawerNav);
