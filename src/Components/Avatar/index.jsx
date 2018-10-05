import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
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
});

class CustomAvatar extends React.Component {
  render() {
    const {
      classes,
      className,
      name,
      image,
      url,
    } = this.props;

    return (
      <Avatar
        aria-label="Recipe"
        className={classNames(
          classes.avatar,
          [className]: className
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
  }
}

CustomAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomAvatar);
