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

class Notice extends React.Component {
  mounted = false;

  state = {
    open: false,
    message: {},
  };

  async componentDidMount() {
    this.mounted = true;

    // Prevent search engines from indexing the notification.
    if (/glebot/.test(navigator.userAgent)) {
      return;
    }

    await getMessages();
    this.handleMessage();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleMessage = () => {
    const lastSeen = getLastSeenNotice();
    const unseenMessages = messages.filter(message => {
      if (message.id <= lastSeen) {
        return false;
      }

      return true;
    });

    if (unseenMessages.length > 0 && this.mounted) {
      this.setState({ message: unseenMessages[0], open: true });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
    localStorage.setItem('lastSeenNotice', this.state.message.id);
  };

  render() {
    const { message, open } = this.state;

    return (
      <Snackbar
        key={message.id}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ 'aria-describedby': 'notification-message' }}
        message={
          // eslint-disable-next-line
          <span id="notification-message" dangerouslySetInnerHTML={{ __html: message.text }} />
        }
        action={
          <Button size="small" color="secondary" onClick={this.handleClose}>
            关闭
          </Button>
        }
        open={open}
        autoHideDuration={20e3}
        onClose={this.handleClose}
        onExited={this.handleMessage}
      />
    );
  }
}

export default Notice;
