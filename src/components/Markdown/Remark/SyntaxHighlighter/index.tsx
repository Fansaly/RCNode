import { useTheme } from '@mui/material/styles';
import { Prism as Highlighter } from 'react-syntax-highlighter';
// light: prism coy coyWithoutShadows oneDark oneLight
// dark: okaidia oneDark tomorrow vscDarkPlus
import {
  okaidia as dark,
  prism as light,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

const languageAlias: { [key: string]: string } = {
  h: 'c',
  rb: 'ruby',
  py: 'python',
  sh: 'shell',
  yml: 'yaml',
  golang: 'go',
  dockerfile: 'docker',
  tex: 'latex',
  bat: 'batch',
  ps1: 'powershell',
  psm1: 'powershell',
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const SyntaxHighlighter = ({ node, inline, className, children, ...props }: any) => {
  const theme = useTheme();
  const match = /language-(\w+)/.exec(className || '');

  let language;
  if (match) {
    language = languageAlias[match[1]] || match[1];
  }

  return !inline && language ? (
    <Highlighter
      className={className}
      style={theme.palette.mode === 'light' ? light : dark}
      // eslint-disable-next-line react/no-children-prop
      children={String(children).replace(/\n$/, '')}
      language={language}
      wrapLines
      {...props}
    />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default SyntaxHighlighter;
