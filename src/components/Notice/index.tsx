import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

interface Message {
  id: number;
  text: string;
}

let messages: Message[] = [];

const sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const getLastSeenId = () => {
  const seen = localStorage.getItem('LastSeenId');
  return !seen ? 0 : parseInt(seen, 10);
};

const Notice = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<null | Message>(null);

  const handleSeeMessage = () => {
    if (!messages) {
      return;
    }

    const lastSeen = getLastSeenId();
    const unseenMessages = messages.filter((msg) => msg.id && msg.id > lastSeen);

    if (unseenMessages.length > 0) {
      setMessage(unseenMessages[0]);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('LastSeenId', message?.id as unknown as string);
  };

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    // Prevent search engines from indexing the notification.
    if (/glebot/.test(navigator.userAgent)) {
      return;
    }

    (async () => {
      try {
        if (!messages) {
          await sleep(1500); // Soften the pressure on the main thread.
          const result = await fetch(
            'https://raw.githubusercontent.com/Fansaly/RCNode/master/messages.json',
            { signal: controller.signal },
          );

          messages = await result.json();
        }
      } catch (err) {
        // Swallow the exceptions.
      }
      messages = messages || [];

      if (mounted) {
        handleSeeMessage();
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return !message ? null : (
    <Snackbar
      key={message.id}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ContentProps={{ 'aria-describedby': 'notification-message' }}
      message={
        <span
          id="notification-message"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: message.text as string }}
        />
      }
      action={
        <Button size="small" color="secondary" onClick={handleClose}>
          关闭
        </Button>
      }
      open={open}
      autoHideDuration={20e3}
      TransitionProps={{ onExited: handleSeeMessage }}
      onClose={handleClose}
    />
  );
};

export default Notice;
