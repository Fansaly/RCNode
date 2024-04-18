import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeVideo from 'rehype-video';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

import { useSelector } from '@/store';

import Link from './Link';
import { atUser } from './plugins';
import SyntaxHighlighter from './SyntaxHighlighter';

const useStyles = makeStyles((theme) => ({
  'code-error': {
    color: theme.palette.secondary.main,
  },
}));

const rehypePlugins = [rehypeVideo, rehypeAutolinkHeadings, atUser];

const Remark = ({ markdownSource }: { markdownSource: string }) => {
  const { renderHTML } = useSelector((state) => state.settings);
  const classes = useStyles();

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <Typography className={classes['code-error']}>{error.message}</Typography>
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGemoji]}
        rehypePlugins={renderHTML ? [rehypeRaw, ...rehypePlugins] : rehypePlugins}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        components={{
          a: (props: any) => <Link {...props} />,
          code: (props: any) => <SyntaxHighlighter {...props} />,
        }}
      >
        {markdownSource}
      </ReactMarkdown>
    </ErrorBoundary>
  );
};

export default Remark;
