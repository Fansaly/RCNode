import makeStyles from '@mui/styles/makeStyles';

import { AppFrame } from '@/layout';

import Feature from './_Feature';
import Markdown from './_Markdown';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 50,
    '&>div:not(:first-child)': {
      marginTop: 40,
    },
  },
}));

const Test = () => {
  const classes = useStyles();

  return (
    <AppFrame title="TEST">
      <div className={`wrapper ${classes.root}`}>
        <Feature />
        <Markdown />
      </div>
    </AppFrame>
  );
};

export default Test;
