import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTransition, useChain, animated } from 'react-spring';

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
  simple: {
    position: 'relative',
    marginTop: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '&:before': {
      position: 'absolute',
      content: '""',
      top: 0,
      left: 2,
      right: 2,
      height: 1,
      backgroundColor: 'rgba(0,0,0,.06)',
    },
    '&:first-child:before': {
      backgroundColor: 'transparent',
    },
  },
}));

const TransTopiCards = ({ items, simple = false, classes = {}, className, ...rest }) => {
  const transitionRef = React.useRef();
  const transitions = useTransition(items, item => item.id, {
    ref: transitionRef,
    unique: true,
    trail: 1000 / items.length,
    from: { willChange: 'opacity, transform', opacity: 0, transform: simple ? 'translate3d(30px,0,0)' : 'translate3d(0,8px,0)' },
    enter: { willChange: 'unset', opacity: 1, transform: 'translate3d(0,0,0)' },
  });

  useChain([transitionRef], simple ? [.9, .105] : [1.08, .68]);

  const styles = useStyles();
  return (
    <div className={clsx(styles.margin, classes.root, className)} {...rest}>
      {transitions.map(({item, key, props}) => (
        <animated.div
          className={clsx(styles.margin, classes.wrap, {
            [styles.simple]: simple,
          })}
          style={props}
          key={key}
        >
          <TopiCard className={clsx(classes.card)} simple={simple} item={item} />
        </animated.div>
      ))}
    </div>
  );
};

TransTopiCards.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  simple: PropTypes.bool,
  items: PropTypes.array.isRequired,
};

export default TransTopiCards;
