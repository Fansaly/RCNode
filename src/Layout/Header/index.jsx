import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Me from '../../Components/Me';
import NormalNav from '../Nav/NormalNav';
import DrawerNav from '../Nav/DrawerNav';

import { animateScroll } from 'react-scroll';
import LogoSvg from '../../static/cnodejs/cnodejs_light.svg';
import './header.styl';

const styles = theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...theme.mixins.toolbar,
  },
  navPlaceholder: {
    height: 48,
    '@media (max-width: 768px)': {
      height: 38,
    },
  },
  navHidden: {
    height: 0,
  },
});

class Header extends React.Component {
  state = {
    isMobile: false,
    navHidden: false,
    drawerOpen: false,
  };

  handleScrollToTop = event => {
    if (event.target === event.currentTarget) {
      animateScroll.scrollTo(0, {
        duration: 500,
        smooth: 'easeInOutQuart',
      });
    }
  };

  toggleNav = () => {
    const { pathname } = this.props.location;
    const navHidden = pathname !== '/';

    this.setState({ navHidden });
  };

  handleNavToggle = () => {
    let { navHidden, drawerOpen } = this.state;

    if (isWidthUp('md', this.props.width)) {
      navHidden = !navHidden;
      drawerOpen = false;
    } else {
      drawerOpen = !drawerOpen;
    }

    this.setState({
      navHidden,
      drawerOpen,
    });
  };

  componentWillMount() {
    this.toggleNav();
  }

  render() {
    const { navHidden, drawerOpen } = this.state;
    const { classes, width } = this.props;

    return (
      <React.Fragment>
        <div className={classes.toolbar} />
        <div className={classNames(classes.navPlaceholder, {
          [classes.navHidden]: !isWidthUp('md', width) || navHidden || drawerOpen,
        })} />
        <AppBar id="header" position="fixed">
          <Toolbar onClick={this.handleScrollToTop}>
            <IconButton
              color="inherit"
              onClick={this.handleNavToggle}
            >
              <MenuIcon />
            </IconButton>
            <div id="logo">
              <Hidden xsDown>
                <Link to="/">
                  <LogoSvg className="logo" />
                </Link>
              </Hidden>
            </div>

            <Me />
          </Toolbar>
          <Hidden smDown implementation="css">
            {!navHidden && <NormalNav />}
          </Hidden>
        </AppBar>

        <Hidden mdUp>
          <DrawerNav
            open={drawerOpen}
            onClose={this.handleNavToggle}
          />
        </Hidden>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  withWidth(),
  withRouter,
)(Header);
