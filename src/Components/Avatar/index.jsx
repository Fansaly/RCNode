import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  avatar: {
    '& a': {
      display: 'flex',
    },
    '& img': {
      display: 'inline-flex',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 12,
      lineHeight: 0,
      textIndent: 20,
    },
  },
}));

const CustomAvatar = (props) => {
  const classes = useStyles();
  const {
    className,
    name,
    image,
    url,
  } = props;

  return (
    <Avatar
      aria-label="Recipe"
      className={clsx(
        classes.avatar,
        className,
      )}
    >
      {url ? (
        <Link to={name ? url : '/'}>
          {image &&
            <img src={image} alt={name || '用户已注销'} />
          }
        </Link>
      ) : (
        <a>
          {image &&
            <img src={image} alt={name || '用户已注销'} />
          }
        </a>
      )}
    </Avatar>
  );
};

CustomAvatar.propTypes = {
  className: PropTypes.string,
};

export default CustomAvatar;
