import LinearProgress from '@mui/material/LinearProgress';

const Loadding = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <LinearProgress />
    </div>
  );
};

export default Loadding;
