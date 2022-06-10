import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import React from 'react';

import { useDispatch, useSelector } from '@/store';

const Theme = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

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

  return (
    <React.Fragment>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.8}>
        <div>主题模式</div>
        <IconButton
          size="large"
          color="inherit"
          disabled={settings.autoFollow}
          onClick={handleToggleTheme}
        >
          {settings.theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.8}>
        <div>跟随系统</div>
        <Switch
          color="primary"
          checked={settings.autoFollow}
          onChange={handleChangeAutoFollow}
        />
      </Stack>
    </React.Fragment>
  );
};

export default Theme;
