import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLocation, Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
  header: theme.palette.type === 'light' ? {
    backgroundColor: '#2196f3',
    backgroundImage: 'linear-gradient(150deg, #21d6f3, #2196f3 28%, #ff7ed7 110%)',
    '@media (max-width: 960px)': {
      backgroundImage: 'linear-gradient(150deg, #21d6f3, #2196f3 32%, #ff7ed7 106%)',
    },
    '@media (max-width: 768px)': {
      backgroundImage: 'linear-gradient(150deg, #21d6f3, #2196f3 34%, #ff7ed7 104%)',
    },
    '@media (max-width: 500px)': {
      backgroundImage: 'linear-gradient(150deg, #21d6f3, #2196f3 36%, #ff7ed7 102%)',
    },
  } : {
    backgroundColor: '#363636',
  },
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
}));

const Header = (props) => {
  const { width } = props;
  const classes = useStyles();
  const location = useLocation();

  const [state, setState] = React.useState({
    isMobile: false,
    navHidden: false,
    drawerOpen: false,
  });

  const handleScrollToTop = event => {
    if (event.target === event.currentTarget) {
      animateScroll.scrollTo(0, {
        duration: 500,
        smooth: 'easeInOutQuart',
      });
    }
  };

  const handleToggleNav = () => {
    let { navHidden, drawerOpen } = state;

    if (isWidthUp('md', width)) {
      navHidden = !navHidden;
      drawerOpen = false;
    } else {
      drawerOpen = !drawerOpen;
    }

    setState(prevState => ({ ...prevState, navHidden, drawerOpen }));
  };

  React.useEffect(() => {
    const { pathname } = location;
    const navHidden = pathname !== '/';

    setState(prevState => ({ ...prevState, navHidden }));
  }, [location]);

  return (
    <React.Fragment>
      <div className={classes.toolbar} />
      <div className={clsx(classes.navPlaceholder, {
        [classes.navHidden]: !isWidthUp('md', width) || state.navHidden || state.drawerOpen,
      })} />
      <AppBar id="header" className={classes.header} position="fixed">
        <Toolbar onClick={handleScrollToTop}>
          <IconButton
            color="inherit"
            onClick={handleToggleNav}
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
          {!state.navHidden && <NormalNav />}
        </Hidden>
      </AppBar>

      <Hidden mdUp>
        <DrawerNav
          open={state.drawerOpen}
          onClose={handleToggleNav}
        />
      </Hidden>
    </React.Fragment>
  );
};

Header.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(Header);
