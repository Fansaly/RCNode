import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { animateScroll } from 'react-scroll';

import Logo from '@/components/Logo';
import Me from '@/components/Me';
import { useBreakpoints } from '@/hooks';
import DrawerNav from '@/layout/Nav/DrawerNav';
import NormalNav from '@/layout/Nav/NormalNav';

import styles from './index.module.styl';

const useStyles = makeStyles((theme) => ({
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

const Header = () => {
  const theme = useTheme();
  const classes = useStyles();
  const location = useLocation();
  const isWidthUpMd = useBreakpoints('up', 'md');

  const [state, setState] = React.useState({
    navVisible: false,
    drawerOpen: false,
  });

  const handleScrollToTop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      animateScroll.scrollTo(0, {
        duration: 500,
        smooth: 'easeInOutQuart',
      });
    }
  };

  const handleToggleNav = () => {
    let { navVisible, drawerOpen } = state;

    if (isWidthUpMd) {
      navVisible = !navVisible;
      drawerOpen = false;
    } else {
      drawerOpen = !drawerOpen;
    }

    setState((prevState) => ({ ...prevState, navVisible, drawerOpen }));
  };

  React.useEffect(() => {
    const { pathname } = location;
    const navVisible = pathname === '/';

    setState((prevState) => ({ ...prevState, navVisible }));
  }, [location]);

  return (
    <React.Fragment>
      <div className={classes.toolbar} />
      <div
        className={clsx(classes.navPlaceholder, {
          [classes.navHidden]: !isWidthUpMd || !state.navVisible || state.drawerOpen,
        })}
      />
      <AppBar
        className={clsx(styles.header, {
          light: theme.palette.mode === 'light',
          dark: theme.palette.mode === 'dark',
        })}
        position="fixed"
      >
        <Toolbar onClick={handleScrollToTop}>
          <IconButton color="inherit" size="large" onClick={handleToggleNav}>
            <MenuIcon />
          </IconButton>
          <div className={styles['logo-wrap']}>
            <Hidden smDown>
              <Link to="/">
                <Logo className={styles.logo} color="light" />
              </Link>
            </Hidden>
          </div>

          <Me />
        </Toolbar>

        <Hidden mdDown implementation="css">
          {state.navVisible && <NormalNav />}
        </Hidden>
      </AppBar>

      <Hidden mdUp>
        <DrawerNav open={state.drawerOpen} onClose={handleToggleNav} />
      </Hidden>
    </React.Fragment>
  );
};

export default Header;
