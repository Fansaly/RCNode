import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const isDev = import.meta.env.DEV;

const UpdatePrompt = () => {
  // replaced dynamically
  const buildDate = '__DATE__';
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__';

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    /* eslint-disable no-console */
    onRegisteredSW(swUrl, r) {
      if (isDev) {
        console.groupCollapsed('Service Worker');
        console.log(`Script: ${swUrl}`);
      }

      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            console.log('Checking for sw update');
            r.update();
          }, 3000);
      } else if (isDev) {
        console.log('SW Registered Successful:');
        console.log(r);
        console.groupEnd();
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
    /* eslint-enable no-console */
  });

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (offlineReady || needRefresh) {
      setOpen(true);
    }
  }, [offlineReady, needRefresh]);

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      setOfflineReady(false);
      setNeedRefresh(false);
    }, 200 /* theme.transitions.duration.leavingScreen: 195 */);
  };

  return (
    <Snackbar open={open} key={buildDate} sx={{ maxWidth: 600 }}>
      <Alert
        color="info"
        variant="filled"
        severity={offlineReady ? 'info' : 'success'}
        sx={{ width: '100%' }}
        action={
          <React.Fragment>
            {needRefresh && (
              <Button
                color="secondary"
                size="small"
                onClick={() => updateServiceWorker(true)}
              >
                更新
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        {offlineReady ? 'APP 已准备就绪' : '有新版本可用'}
        <Typography sx={{ display: 'none' }}>{buildDate}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default UpdatePrompt;
