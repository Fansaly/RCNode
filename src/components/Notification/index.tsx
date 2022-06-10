import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Notification = (props: RCNode.Notification) => {
  const { open = false, status = 'info', message = '', onClose } = props;

  const handleClose = () => {
    onClose?.();
  };

  const key = new Date().getTime();

  return (
    <Snackbar
      key={key}
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        severity={status}
        variant="filled"
        sx={{ width: '100%' }}
        elevation={6}
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
