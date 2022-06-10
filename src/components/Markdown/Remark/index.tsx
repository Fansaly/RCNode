import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeVideo from 'rehype-video';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

import { useSelector } from '@/store';

import CopyWrapper from './CopyWrapper';
import Link from './Link';
import { atUser } from './plugins';
import SyntaxHighlighter from './SyntaxHighlighter';

const rehypePlugins = [rehypeVideo, rehypeAutolinkHeadings, atUser];

const Remark = ({ markdownSource }: { markdownSource: string }) => {
  const { renderHTML } = useSelector((state) => state.settings);

  return (
    <ReactMarkdown
      // eslint-disable-next-line react/no-children-prop
      children={markdownSource}
      remarkPlugins={[remarkGfm, remarkGemoji]}
      rehypePlugins={renderHTML ? [rehypeRaw, ...rehypePlugins] : rehypePlugins}
      remarkRehypeOptions={{ allowDangerousHtml: true }}
      components={{
        a: (props: any) => <Link {...props} />,
        code: (props: any) => (
          <CopyWrapper {...props}>
            <SyntaxHighlighter {...props} />
          </CopyWrapper>
        ),
      }}
    />
  );
};

export default Remark;
