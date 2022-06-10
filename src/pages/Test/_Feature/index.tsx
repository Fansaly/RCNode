import EditIcon from '@mui/icons-material/Edit';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import Editor from '@/components/Editor';
import ImageZoom from '@/components/ImageZoom';
import ShareDialog from '@/components/ShareDialog';
import { useDispatch, useSelector } from '@/store';

import Theme from './_Theme';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    top: 72,
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      top: 86,
    },
    [theme.breakpoints.up('md')]: {
      top: 100,
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 10,
      paddingBottom: 10,
    },
  },
  link: {
    marginLeft: 10,
    minWidth: 36,
  },
}));

const url =
  'https://wallpapershome.com/images/wallpapers/hummingbird-3840x2160-solibri-steampunk-flower-leaves-green-drops-1272.jpg';

const Feature = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  const [editor, setEditor] = React.useState<RCNode.Editor>({
    open: false,
    action: 'reply',
    onChange: (data) => {
      setEditor((prevState) => ({ ...prevState, ...data }));
    },
    onClose: () => {
      setEditor((prevState) => ({ ...prevState, open: false }));
    },
    onSubmit: async () => {
      console.log(editor);
    },
  });
  const [preview, setPreview] = React.useState({ open: false, url: '' });
  const [share, setShare] = React.useState<RCNode.Share>({ open: false, url: '' });

  const handleToggleRenderHTML = () => {
    dispatch({ type: 'settings/toggleRenderHTML' });
  };

  const handleOpenEditor = () => {
    setEditor((prevState) => ({
      ...prevState,
      open: true,
      action: 'create',
      title: 'title',
      content: 'content',
    }));
  };

  const handleOpenPreview = () => {
    setPreview((prevState) => ({ ...prevState, open: true, url }));
  };

  const handleClosePreview = () => {
    setPreview((prevState) => ({ ...prevState, open: false }));
  };

  const handleOpenShare = (post: number | string | null = null) => {
    setShare((prevState) => ({ ...prevState, open: true, url, post }));
  };

  const handleCloseShare = () => {
    setShare((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <Paper className={classes.root}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 0.44, md: 2.2 }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.4}>
          <div>渲染 HTML</div>
          <Switch
            color="secondary"
            checked={settings.renderHTML}
            onClick={handleToggleRenderHTML}
          />
        </Stack>
        <Theme />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.4}>
          <div>编辑器</div>
          <IconButton onClick={handleOpenEditor}>
            <EditIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.4}>
          <div>图片</div>
          <IconButton onClick={handleOpenPreview}>
            <InsertPhotoIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
          <div>分享</div>
          <Button
            className={classes.link}
            variant="text"
            size="small"
            onClick={() => handleOpenShare('1')}
          >
            1
          </Button>
          <Button
            className={classes.link}
            variant="text"
            size="small"
            onClick={() => handleOpenShare(2)}
          >
            2
          </Button>
          <Button
            className={classes.link}
            variant="text"
            size="small"
            onClick={() => handleOpenShare()}
          >
            #
          </Button>
        </Stack>
      </Stack>

      <Editor {...editor} />
      <ImageZoom {...preview} onClose={handleClosePreview} />
      <ShareDialog {...share} onClose={handleCloseShare} />
    </Paper>
  );
};

export default Feature;
