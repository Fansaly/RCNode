import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  updateSettings,
  restoreSettings,
} from '../../store/actions';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/lab/Slider';

import Layout from '../../Layout';
import './settings.styl';

const styles = theme => ({
  mark: {
    backgroundColor: 'transparent',
  },
  markLabel: {
    color: 'rgba(0,0,0,.65)',
  },
});

class Settings extends React.Component {
  handleCardPreview = () => {
    const { settings } = this.props;
    this.props.updateSettings({
      ...settings,
      cardPreview: !settings.cardPreview,
    });
  };

  handleChangeTime = (event, value) => {
    const { settings } = this.props;

    this.props.updateSettings({
      ...settings,
      time: value * 60,
    });
  };

  render() {
    const {
      width,
      classes,
      isAuthed,
      settings: {
        time,
        cardPreview,
      },
    } = this.props;

    return (
      <Layout>
        <Helmet title="设置" />

        <div id="settings" className="wrapper">
          <Paper>
            <div className="setting">
              <div className="setting-label">卡片预览</div>
              <Switch
                className="switch"
                checked={cardPreview}
                onChange={this.handleCardPreview}
                color="primary"
              />
            </div>
            <div
              className={classNames('setting', {
                'nano': isWidthDown('xs', width),
              })}
            >
              <div className="setting-label">消息提醒</div>
              <div className="setting-wrapper">
                <Slider
                  disabled={!isAuthed}
                  min={0}
                  max={10}
                  step={null}
                  value={time / 60}
                  marks={[
                    { value: 0, label: 'Off' },
                    { value: 1, label: '1min' },
                    { value: 3, label: '3min' },
                    { value: 5, label: '5min' },
                    { value: 10, label: '10min' },
                  ]}
                  onChange={this.handleChangeTime}
                  classes={{
                    mark: classes.mark,
                    markActive: classes.mark,
                    markLabel: classes.markLabel,
                    markLabelActive: classes.markLabel,
                  }}
                />
              </div>
            </div>
          </Paper>
        </div>
      </Layout>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth, settings }) => ({
  ...auth,
  settings,
});

const mapDispatchToProps = dispatch => ({
  updateSettings: data => {
    dispatch(updateSettings(data));
  },
  restoreSettings: data => {
    dispatch(restoreSettings(data));
  },
});

export default compose(
  withStyles(styles),
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Settings);
