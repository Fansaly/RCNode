import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  updateSettings,
  restoreSettings,
} from '../../store/actions';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/lab/Slider';

import Layout from '../../Layout';
import './settings.styl';

class Settings extends React.Component {
  handleCardPreview = () => {
    const { settings } = this.props;
    this.props.updateSettings({
      ...settings,
      cardPreview: !settings.cardPreview,
    });
  };

  /**
   * second to slider step
   * @param {number} time
   */
  timeToSteps = time => {
    const steps = time / 60;

    switch (steps) {
      case 10:
       return 4;
      case 5:
       return 3;
      case 3:
       return 2;
      default:
       return steps;
    }
  };

  handleSlider = (event, value) => {
    const { settings } = this.props;

    // step to minute
    switch (value) {
      case 4:
        value = 10;
        break;
      case 3:
        value = 5;
        break;
      case 2:
        value = 3;
        break;
      default:
        break;
    }

    this.props.updateSettings({
      ...settings,
      time: value * 60, // minute to second
    });
  }

  render() {
    const {
      width,
      isAuthed,
      settings: {
        time,
        cardPreview,
      },
    } = this.props;

    return (
      <Layout>
        <div id="settings" className="wrapper">
          <Paper>
            <div className="setting">
              <div className="setting-label">卡片预览</div>
              <Switch
                className="switch"
                checked={cardPreview}
                onChange={this.handleCardPreview}
              />
            </div>
            <div
              className={classNames('setting', {
                'nano': isWidthDown('xs', width),
              })}
            >
              <div className="setting-label">消息提醒（每分钟）</div>
              <div className="setting-wrapper">
                <div className="step-label">
                  <span>Off</span>
                  <span>1</span>
                  <span>3</span>
                  <span>5</span>
                  <span>10</span>
                </div>
                <Slider
                  min={0}
                  max={4}
                  step={1}
                  className="slider"
                  disabled={!isAuthed}
                  value={this.timeToSteps(time)}
                  onChange={this.handleSlider}
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
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Settings);
