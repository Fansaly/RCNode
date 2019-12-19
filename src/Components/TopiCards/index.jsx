import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import TopiCard from '../TopiCard';

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: 20,
    '&:first-child': {
      marginTop: 0,
    },
    '@media (max-width: 768px)': {
      marginTop: 16,
    },
  },
}));

const TopiCards = ({ items, simple = false, className, classes = {}, ...rest }) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.margin, className, classes.root)} {...rest}>
      {items.map(item => (
        <TopiCard className={clsx(classes.card)} simple={simple} item={item} key={item.id} />
      ))}
    </div>
  );
};

TopiCards.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  simple: PropTypes.bool,
  items: PropTypes.array.isRequired,
};

export default TopiCards;
