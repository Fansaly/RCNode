import React from 'react';
import Layout from '../../Layout';
import { MarkdownRender } from '../../Components/Markdown';
import markdownContent from './ctx';

class Test extends React.Component {
  render() {
    return (
      <Layout>
        <div className="wrapper">
          <MarkdownRender markdownString={markdownContent} />
        </div>
      </Layout>
    );
  }
}

export default Test;
