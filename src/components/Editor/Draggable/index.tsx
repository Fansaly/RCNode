import Paper, { PaperProps } from '@mui/material/Paper';
import React from 'react';
import ReactDraggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { useEditor } from '../Editor';

const defaultPostion = { x: 0, y: 0 };

const Draggable = (props: PaperProps) => {
  const { editorHeaderId, open, fullScreen, isWidthUpSm } = useEditor();

  const cached = React.useRef(defaultPostion);
  const [position, setPosition] = React.useState(defaultPostion);
  const [disabled, setDisabled] = React.useState(false);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    cached.current = { x: data.x, y: data.y };
    setPosition({ x: data.x, y: data.y });
  };

  React.useEffect(() => {
    setDisabled(!isWidthUpSm || Boolean(fullScreen));
  }, [isWidthUpSm, fullScreen]);

  React.useEffect(() => {
    if (open) {
      setPosition(disabled ? defaultPostion : cached.current);
    }
  }, [open, disabled]);

  return (
    <ReactDraggable
      handle={`#${editorHeaderId}`}
      // bounds={'[class*="MuiDialog-root"]'}
      cancel={'[class*="MuiDialogContent-root"]'}
      position={position}
      disabled={disabled}
      onDrag={handleDrag}
    >
      <Paper {...props} />
    </ReactDraggable>
  );
};

export default Draggable;
