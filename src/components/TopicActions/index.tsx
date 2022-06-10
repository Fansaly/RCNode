import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/ModeComment';
import ShareIcon from '@mui/icons-material/Share';
import AppBar from '@mui/material/AppBar';
import Fab from '@mui/material/Fab';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Zoom from '@mui/material/Zoom';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

import { useBreakpoints } from '@/hooks';

const useStyles = makeStyles((theme) => ({
  appbar: {
    top: 'auto',
    bottom: 0,
    boxShadow: 'none',
  },
  wrapper: {
    position: 'relative',
  },
  action: {
    position: 'absolute',
    right: theme.spacing(3.5),
    bottom: theme.spacing(4),
  },
  fabMoveUp: {
    transform: 'translate3d(0, -56px, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  fabMoveDown: {
    transform: 'translate3d(0, 0, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
}));

type TAEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
  visible?: boolean;
  single?: boolean;
  create?: boolean;
  favorite?: boolean;
  notificationOpen?: boolean;
  onCreate?(event?: TAEvent): void;
  onUpdate?(event?: TAEvent): void;
  onReply?(event?: TAEvent): void;
  onShare?(event?: TAEvent): void;
  onFavorite?(event?: TAEvent): void;
}

const TopicActions = (props: Props) => {
  const {
    visible,
    single = false,
    create = false,
    favorite = false,
    notificationOpen = false,
    onCreate,
    onUpdate,
    onReply,
    onShare,
    onFavorite,
  } = props;

  const classes = useStyles();
  const isWidthUpSm = useBreakpoints('up', 'sm');
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (visible) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = (event: TAEvent) => {
    onCreate?.(event);
  };

  const handleClick = (event: TAEvent) => {
    if (open && create) {
      handleUpdate(event);
    }
    setOpen((prevState) => !prevState);
  };

  const handleUpdate = (event: TAEvent) => {
    onUpdate?.(event);
  };

  const handleReply = (event: TAEvent) => {
    handleClose();
    onReply?.(event);
  };

  const handleShare = (event: TAEvent) => {
    handleClose();
    onShare?.(event);
  };

  const handleFavorite = (event: TAEvent) => {
    handleClose();
    onFavorite?.(event);
  };

  return (
    <AppBar className={classes.appbar} component="div" color="default">
      <div className={classes.wrapper}>
        {single ? (
          <Zoom in={visible} unmountOnExit>
            <Fab className={classes.action} color="secondary" onClick={handleCreate}>
              <EditIcon />
            </Fab>
          </Zoom>
        ) : (
          <SpeedDial
            className={clsx(classes.action, {
              [classes.fabMoveUp]: !isWidthUpSm && notificationOpen,
              [classes.fabMoveDown]: !isWidthUpSm && !notificationOpen,
            })}
            open={open}
            hidden={!visible}
            color="secondary"
            ariaLabel="topic-actions"
            icon={create ? <SpeedDialIcon openIcon={<EditIcon />} /> : <SpeedDialIcon />}
            FabProps={{ onClick: handleClick }}
            onOpen={handleOpen}
            onClose={handleClose}
          >
            <SpeedDialAction
              tooltipTitle=""
              icon={<ReplyIcon />}
              FabProps={{ onClick: handleReply }}
            />
            <SpeedDialAction
              tooltipTitle=""
              icon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              FabProps={{ onClick: handleFavorite }}
            />
            <SpeedDialAction
              tooltipTitle=""
              icon={<ShareIcon />}
              FabProps={{ onClick: handleShare }}
            />
          </SpeedDial>
        )}
      </div>
    </AppBar>
  );
};

export default TopicActions;
