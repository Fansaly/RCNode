import './settings.styl';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

import { useBreakpoints } from '@/hooks';
import { AppFrame } from '@/layout';
import { useDispatch, useSelector } from '@/store';

const useStyles = makeStyles(() => ({
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

const Settings = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isWidthDownSm = useBreakpoints('down', 'sm');

  const {
    auth: { isAuthed },
    settings,
  } = useSelector((state) => state);

  const handleToggleTheme = () => {
    const mode = theme.palette.mode === 'light' ? 'dark' : 'light';
    dispatch({
      type: 'settings/update',
      payload: { theme: mode },
    });
  };

  const handleChangeAutoFollow = () => {
    dispatch({
      type: 'settings/update',
      payload: {
        autoFollow: !settings.autoFollow,
      },
    });
  };

  const handlePreviewCard = () => {
    dispatch({
      type: 'settings/update',
      payload: {
        cardPreview: !settings.cardPreview,
      },
    });
  };

  const handleChangeTime = (event: Event, value: number | number[]) => {
    dispatch({
      type: 'settings/update',
      payload: {
        time: (value as number) * 60,
      },
    });
  };

  const handleRestoreSettings = () => {
    dispatch({ type: 'settings/restore' });
  };

  return (
    <AppFrame>
      <div id="settings" className="wrapper">
        <Typography className={classes.title}>外观</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">主题模式</div>
            <IconButton
              color="inherit"
              size="large"
              disabled={settings.autoFollow}
              onClick={handleToggleTheme}
            >
              {settings.theme === 'light' ? (
                <Brightness4Icon fontSize="inherit" />
              ) : (
                <Brightness7Icon fontSize="inherit" />
              )}
            </IconButton>
          </div>
          <div className="setting">
            <div className="setting-label">跟随系统</div>
            <Switch
              className="switch"
              color="primary"
              size="medium"
              checked={settings.autoFollow}
              onChange={handleChangeAutoFollow}
            />
          </div>
        </Paper>

        <Typography className={classes.title}>卡片</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">摘要预览</div>
            <Switch
              className="switch"
              color="primary"
              size="medium"
              checked={settings.cardPreview}
              onChange={handlePreviewCard}
            />
          </div>
        </Paper>

        <Typography className={classes.title}>消息</Typography>
        <Paper>
          <div
            className={clsx('setting', {
              nano: isWidthDownSm,
            })}
          >
            <div className="setting-label">提醒间隔（分钟）</div>
            <div className="setting-wrapper">
              <Slider
                classes={{
                  mark: classes.mark,
                  markActive: classes.mark,
                }}
                size="small"
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
                disabled={!isAuthed}
                onChange={handleChangeTime}
              />
            </div>
          </div>
        </Paper>

        <Typography className={classes.title}>重置</Typography>
        <Paper>
          <div className="setting">
            <div className="setting-label">将所有设置还原为原始默认设置</div>
            <IconButton color="inherit" size="large" onClick={handleRestoreSettings}>
              <SettingsBackupRestoreIcon fontSize="inherit" />
            </IconButton>
          </div>
        </Paper>
      </div>
    </AppFrame>
  );
};

export default Settings;
