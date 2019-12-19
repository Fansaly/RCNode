import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import { AppWrapper } from '../../Layout';
import './settings.styl';

const useStyles = makeStyles(theme => ({
  title: {
    marginTop: 30,
    marginBottom: 14,
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: 15,
  },
  mark: {
    backgroundColor: 'transparent',
  },
}));

const Settings = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    auth: { isAuthed },
    settings,
  } = useSelector(state => state);

  const handleToggleThemeMode = () => {
    const themeMode = theme.palette.type === 'light' ? 'dark' : 'light';
    dispatch({
      type: 'UPDATE_SETTINGS',
      data: { ...settings, themeMode },
    });
  };

  const handleChangeAutoFollow = () => {
    const autoFollow = !settings.autoFollow;
    dispatch({
      type: 'UPDATE_SETTINGS',
      data: { ...settings, autoFollow },
    });
  };

  const handleCardPreview = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      data: {
        ...settings,
        cardPreview: !settings.cardPreview,
      },
    });
  };

  const handleChangeTime = (event, value) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      data: {
        ...settings,
        time: value * 60,
      },
    });
  };

  const handleRestoreSettings = () => {
    dispatch({ type: 'RESTORE_SETTINGS' });
  };

  return (
    <AppWrapper title="设置">
      <div id="settings" className="wrapper">
        <Typography className={classes.title}>外观</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">主题模式</div>
            <IconButton
              color="inherit"
              onClick={handleToggleThemeMode}
              disabled={settings.autoFollow}
            >
              {settings.themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </div>
          <div className="setting">
            <div className="setting-label">跟随系统</div>
            <Switch
              className="switch"
              checked={settings.autoFollow}
              onChange={handleChangeAutoFollow}
              color="primary"
            />
          </div>
        </Paper>

        <Typography className={classes.title}>卡片</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">摘要预览</div>
            <Switch
              className="switch"
              checked={settings.cardPreview}
              onChange={handleCardPreview}
              color="primary"
            />
          </div>
        </Paper>

        <Typography className={classes.title}>消息</Typography>
        <Paper>
          <div
            className={clsx('setting', {
              'nano': isWidthDown('xs', props.width),
            })}
          >
            <div className="setting-label">提醒间隔（分钟）</div>
            <div className="setting-wrapper">
              <Slider
                disabled={!isAuthed}
                min={0}
                max={10}
                step={null}
                value={settings.time / 60}
                marks={[
                  { value: 0, label: '关' },
                  { value: 1, label: '1' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
                onChange={handleChangeTime}
                classes={{
                  mark: classes.mark,
                  markActive: classes.mark,
                }}
              />
            </div>
          </div>
        </Paper>

        <Typography className={classes.title}>重置</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">将所有设置还原为原始默认设置</div>
            <Button
              onClick={handleRestoreSettings}
              variant="outlined"
            >
              重置
            </Button>
          </div>
        </Paper>
      </div>
    </AppWrapper>
  );
};

Settings.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(Settings);
