import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation, useNavigate } from 'react-router-dom';

import { TabIcon } from '@/components/Icons';
import Logo from '@/components/Logo';
import { navIsActive, navTabsArray as navTabs } from '@/router';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 214,
    backdropFilter: 'blur(20px)',
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(255,255,255,.86)' : 'rgba(66,66,66,.88)',
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
  nav: {
    '& .Mui-selected': {
      backgroundColor:
        theme.palette.mode === 'light' ? 'rgba(0,0,0,.08)' : 'rgba(208,209,210,.16)',
    },
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

const DrawerNav = ({ open, onClose }: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return navIsActive(path, location);
  };

  const handleClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <SwipeableDrawer
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true,
      }}
      open={open}
      variant="temporary"
      onOpen={() => null}
      onClose={handleClose}
    >
      <div className={`${classes.toolbar} ${classes.logo}`}>
        <Logo reverse />
      </div>

      <List className={classes.nav}>
        {navTabs.map(({ key: tab, path, name }) => (
          <ListItem
            key={tab}
            button
            component="a"
            selected={isActive(path)}
            onClick={() => handleClick(path)}
          >
            <ListItemIcon className={classes.spacing}>
              <TabIcon
                tab={tab}
                all={tab === 'all'}
                good={tab === 'good'}
                color="inherit"
              />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
};

export default DrawerNav;
