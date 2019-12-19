import React from 'react';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function getLastSeenNotice() {
  const seen = localStorage.getItem('lastSeenNotice');
  return !Boolean(seen) ? 0 : parseInt(seen, 10);
}

let messages = null;

async function getMessages() {
  try {
    if (!messages) {
      await sleep(1500); // Soften the pressure on the main thread.
      const result = await fetch(
        'https://raw.githubusercontent.com/Fansaly/RCNode/master/messages.json',
      );
      messages = await result.json();
    }
  } catch (err) {
    // Swallow the exceptions.
  }

  messages = messages || [];
}

const Notice = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState({});

  const handleMessage = () => {
    const lastSeen = getLastSeenNotice();
    const unseenMessages = messages.filter(msg => msg.id > lastSeen);

    if (unseenMessages.length > 0) {
      setMessage(unseenMessages[0]);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('lastSeenNotice', message.id);
  };

  React.useEffect(() => {
    let mounted = true;

    // Prevent search engines from indexing the notification.
    if (/glebot/.test(navigator.userAgent)) {
      return;
    }

    (async () => {
      await getMessages();
      if (mounted) {
        handleMessage();
      }
    })();

    return () => mounted = false;
  }, []);

  return (
    <Snackbar
      key={message.id}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ContentProps={{ 'aria-describedby': 'notification-message' }}
      message={
        <span
          id="notification-message"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      }
      action={
        <Button size="small" color="secondary" onClick={handleClose}>
          关闭
        </Button>
      }
      open={open}
      autoHideDuration={20e3}
      onClose={handleClose}
      onExited={handleMessage}
    />
  );
};

export default Notice;
