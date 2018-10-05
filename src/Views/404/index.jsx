import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MdOutletIcon from '../../static/ionicons_md_outlet.svg';

const styles = theme => ({
  main: {
    paddingTop: 120,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: 0,
      overflow: 'hidden',
    },
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: 62,
      marginTop: -32,
    },
  },
  h1: {
    marginRight: 45,
    paddingRight: 45,
    fontSize: 80,
    borderRight: '3px solid #7b7b7b',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: 32,
      paddingRight: 0,
      border: 'none',
    },
  },
  p: {
    fontSize: 20,
    textAlign: 'left',
    flexDirection: 'column',
  },
  icon: {
    width: '1em',
    height: '1em',
    fontSize: 60,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 32,
    },
  },
});

class NotFound extends React.Component {
  handleBackToHome = () => {
    this.props.history.push('/');
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classNames('flex', {
        [classes.main]: classes.main,
        [classes.center]: classes.center,
      })}>
        <div className={classNames('flex', {
          [classes.wrapper]: classes.wrapper,
          [classes.center]: classes.center,
        })}>
          <h1 className={classes.h1}>404</h1>
          <p className={classNames('flex', {
            [classes.p]: classes.p,
            [classes.center]: classes.center,
          })}>
            <MdOutletIcon className={classes.icon} />
            <span>Page not Found</span>
          </p>
        </div>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={this.handleBackToHome}
        >
          Back to Home
        </Button>
      </div>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);
