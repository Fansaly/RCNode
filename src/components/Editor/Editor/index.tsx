import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router-dom';

import Notification from '@/components/Notification';
import { useBreakpoints } from '@/hooks';
import { matchTab, topicTabs } from '@/router';

import Draggable from '../Draggable';
import Header from '../Header';
import Preview from '../Preview';

const useStyles = makeStyles(() => ({
  header: {
    padding: '24px 0 14px 24px',
  },
  title: {
    margin: 0,
    padding: '0 24px 18px',
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  content: {
    margin: 0,
    '&>div': {
      padding: 0,
      height: 230,
      '& textarea': {
        height: '100% !important',
        overflowY: 'auto !important',
      },
    },
    '&.simple>div': {
      height: 276,
    },
    '&.fullScreen>div': {
      flex: 1,
      height: 'auto',
    },
  },
  actions: {
    margin: 0,
    padding: '10px 24px',
  },
  button: {
    margin: 0,
    minWidth: 110,
  },
  doit: {
    marginLeft: 16,
  },
  cancel: {
    marginLeft: 0,
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide ref={ref} direction="up" {...props} />;
});

const EditorContext = React.createContext({
  editorHeaderId: 'editor-header',
  open: false,
  fullScreen: false,
  isWidthUpSm: false,
});

export const useEditor = () => {
  return React.useContext(EditorContext);
};

interface State {
  readonly validation: {
    title: {
      max: number;
      min: number;
    };
    content: {
      max: number | null;
      min: number;
    };
  };
  isOK: boolean;
  changed: boolean;
  preview: boolean;
  fullScreen: boolean;
  disabled: boolean;
}

const initialState: State = {
  // https://github.com/cnodejs/nodeclub/blob/master/api/v1/topic.js#L140-L151
  validation: {
    title: {
      max: 100,
      min: 5,
    },
    content: {
      max: null,
      min: 3,
    },
  },
  isOK: false,
  changed: false,
  preview: false,
  fullScreen: false,
  disabled: false,
};

const Editor = ({ draggable, ...props }: RCNode.Editor & { draggable?: boolean }) => {
  const classes = useStyles();
  const location = useLocation();
  const isWidthUpSm = useBreakpoints('up', 'sm');

  const [editor, setEditor] = React.useState<State>(initialState);
  const { validation, isOK, changed, preview, fullScreen, disabled } = editor;
  const { open, action, title, content, topicTab, onChange, onSubmit, onClose } = props;

  const [state, setState] = React.useState<{ title?: string; content?: string }>({});
  const [notification, setNotification] = React.useState<RCNode.Notification>({
    open: false,
    status: 'info',
    message: '',
  });
  const titleRef = React.useRef<null | HTMLInputElement>(null);
  const contentRef = React.useRef<null | HTMLInputElement>(null);

  const key = new Date().getTime();
  const editorId = `editor-${key}`;
  const editorHeaderId = `editor-header-${key}`;

  const handleFocus = () => {
    if (['create', 'update'].includes(action)) {
      titleRef.current && titleRef.current.focus();
    } else {
      contentRef.current && contentRef.current.focus();
    }
  };

  const handleSetTopicTab = (topicTab: RCNode.CNodeTopicTab) => {
    onChange?.({ topicTab });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === 'title') {
      value = value.replace(/\n/g, '');
    }

    onChange?.({ [name]: value });
  };

  const handleOpenPreview = () => {
    if (!content || content.trim().length < validation.content.min) {
      setNotification((prevState) => ({
        ...prevState,
        open: true,
        status: 'info',
        message: '太短了哟。',
      }));
    } else {
      setEditor((prevState) => ({ ...prevState, preview: !prevState.preview }));
    }
  };

  const handleClosePreview = () => {
    setEditor((prevState) => ({ ...prevState, preview: !prevState.preview }));
  };

  const handleFullScreen = () => {
    setEditor((prevState) => ({ ...prevState, fullScreen: !prevState.fullScreen }));
  };

  const checkTab = () => {
    if (/(reply)/.test(action)) {
      return true;
    }

    const result = topicTabs.includes(topicTab as RCNode.CNodeTopicTab);

    if (!result) {
      setNotification((prevState) => ({
        ...prevState,
        open: true,
        status: 'error',
        message: '请选择一个主题分类',
      }));
    }

    return result;
  };

  const handleSubmit = async () => {
    if (!isOK || !checkTab()) {
      return;
    }

    setEditor((prevState) => ({ ...prevState, disabled: true }));

    await onSubmit?.();

    setEditor((prevState) => ({ ...prevState, disabled: false }));
  };

  const handleClose = () => {
    if (!disabled) {
      onClose?.();
    }
  };

  React.useEffect(() => {
    if (open) {
      setState({ title, content });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open || topicTab) {
      return;
    }

    let tab = matchTab(location) as RCNode.CNodeTopicTab;
    if (!tab || topicTabs.indexOf(tab) === -1) {
      tab = topicTabs[0];
    }

    onChange?.({ topicTab: tab });
  }, [open, location]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const checkTitle = () => {
      return /(reply)/.test(action)
        ? true
        : typeof title === 'string'
          ? title.length >= validation.title.min && title.length <= validation.title.max
          : false;
    };

    const checkContent = () => {
      return typeof content === 'string'
        ? content.length >= validation.content.min
        : false;
    };

    const isOK = checkTitle() && checkContent();
    const changed = title !== state.title || content !== state.content;
    setEditor((prevState) => ({ ...prevState, isOK, changed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, action, title, content, validation]);

  return (
    <EditorContext.Provider value={{ editorHeaderId, open, fullScreen, isWidthUpSm }}>
      <Dialog
        PaperProps={{ id: editorId }}
        open={open}
        maxWidth="sm"
        fullWidth
        fullScreen={!isWidthUpSm || fullScreen}
        keepMounted={!isWidthUpSm}
        TransitionProps={{ onEntered: handleFocus }}
        TransitionComponent={Transition}
        {...(draggable ? { PaperComponent: Draggable } : {})}
        onClose={handleClose}
      >
        <Header
          className={classes.header}
          editorId={editorId}
          editorHeaderId={editorHeaderId}
          draggable={draggable}
          action={action}
          topicTab={topicTab}
          fullScreen={fullScreen}
          disabled={disabled}
          onSetTopicTab={handleSetTopicTab}
          onPreview={handleOpenPreview}
          onFullScreen={handleFullScreen}
        />
        {['create', 'update'].includes(action) && (
          <TextField
            className={classes.title}
            inputRef={titleRef}
            name="title"
            value={title}
            multiline
            minRows="1"
            maxRows="3"
            fullWidth
            margin="normal"
            variant="standard"
            placeholder="标题..."
            disabled={disabled}
            onChange={handleChange}
          />
        )}
        <DialogContent className={clsx('flex', classes.dialogContent)}>
          <TextField
            className={clsx(classes.content, {
              simple: action === 'reply',
              fullScreen: fullScreen,
            })}
            inputRef={contentRef}
            name="content"
            value={content}
            multiline
            fullWidth
            margin="normal"
            variant="standard"
            placeholder="写些什么呢？"
            disabled={disabled}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            className={clsx(classes.button, classes.cancel)}
            color="inherit"
            size="large"
            disabled={disabled}
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            className={clsx(classes.button, classes.doit)}
            color="primary"
            size="large"
            variant="contained"
            disabled={!isOK || disabled || (action === 'update' && !changed)}
            onClick={handleSubmit}
          >
            {action === 'create' ? '发布' : action === 'update' ? '更新' : '回复'}
          </Button>
        </DialogActions>
      </Dialog>

      <Preview open={preview} content={content} onClose={handleClosePreview} />
      <Notification
        {...notification}
        onClose={() => {
          setNotification((prevState) => ({ ...prevState, open: false }));
        }}
      />
    </EditorContext.Provider>
  );
};

export default Editor;
