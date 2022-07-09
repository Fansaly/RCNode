const tags: string[] = [
  'a',
  'pre',
  'code',
  'hr',
  'br',
  'img',
  'svg',
  'path',
  'video',
  'audio',
  'input',
  'button',
  'head',
  'base',
  'meta',
  'link',
  'title',
  'style',
  'script',
  'time',
  'progress',
  'canvas',
];

interface TreeProps {
  type: string;
  value?: string;
  tagName?: string;
  children?: TreeProps[];
  properties?: {
    href?: string;
    title?: string;
    className?: string[];
    [key: string]: any;
  };
  position?: {
    start: Record<string, any>;
    end: Record<string, any>;
  };
}

const atConvertor = (node: TreeProps) => {
  const { value } = node;

  if (!value || /^\s+$/.test(value) || !/@[\w\-_]+/.test(value)) {
    return;
  }

  const children: TreeProps[] = [];

  value.split(/(@[\w\-_]+)/).forEach((text) => {
    const node = { type: 'text', value: text };

    if (/^@[\w\-_]+$/.test(text)) {
      const name = text.replace(/^@/, '');
      children.push({
        type: 'element',
        tagName: 'a',
        children: [node],
        properties: {
          href: `/user/${name}`,
          target: '_blank',
          className: ['hi'],
        },
      });
    } else if (text) {
      children.push(node);
    }
  });

  delete node.value;
  Object.assign(node, { type: 'element', tagName: 'span', children });
};

const atUser = () => (tree: TreeProps) => {
  const search = (tree: TreeProps) => {
    if (tree.type === 'text') {
      atConvertor(tree);
    } else if (!tags.includes(tree.tagName as string) && Array.isArray(tree.children)) {
      tree.children.forEach((node: TreeProps) => {
        search(node);
      });
    }
  };

  search(tree);
};

export default atUser;
