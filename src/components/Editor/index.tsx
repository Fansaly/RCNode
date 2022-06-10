import Editor from './Editor';

const DraggableEditor = (props: RCNode.Editor) => {
  return <Editor {...props} draggable />;
};

export { DraggableEditor as default, Editor };
