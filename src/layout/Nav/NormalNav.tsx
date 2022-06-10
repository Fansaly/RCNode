import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import { NavLink, useLocation } from 'react-router-dom';

import { navIsActive, navTabsArray as navTabs } from '@/router';

import styles from './normal-nav.module.styl';

const useStyles = makeStyles((theme) => ({
  root: {
    [`&.current .${styles.type}`]: {
      color: theme.palette.mode === 'light' ? '#fff' : '#ccc',
    },
  },
}));

const NormalNav = () => {
  const classes = useStyles();
  const location = useLocation();

  const isActive = (path: string) => {
    return navIsActive(path, location);
  };

  return (
    <Grid
      className={styles['type-content']}
      container
      alignItems="center"
      justifyContent="center"
    >
      {navTabs.map(({ path, name }) => (
        <NavLink
          to={path}
          key={path}
          className={() => {
            const className = classes.root;
            return isActive(path) ? `${className} current` : className;
          }}
        >
          <Button className={styles.type} disableFocusRipple>
            {name}
          </Button>
        </NavLink>
      ))}
    </Grid>
  );
};

export default NormalNav;
