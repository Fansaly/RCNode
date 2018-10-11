import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Layout from '../../Layout';
import { MarkdownRender } from '../../Components/Markdown';

import f1_0 from './_@_single.md';
import f1_1 from './_@_single_prev_space.md';
import f1_2 from './_@_single_next_space.md';
import f2_0 from './_@_mail.md';
import f3_0 from './_url.md';
// import f4 from './_ctx.md';

const mdFile = [
  f1_0,
  f1_1,
  f1_2,
  f2_0,
  f3_0,
];

const styles = theme => ({
  md: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 2,
    boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.15)',
  },
});

class Test extends React.Component {
  state = { text: [] };

  fetchMD = () => {
    mdFile.forEach(async file => {
      fetch(file)
        .then(res => {
          return res.text();
        })
        .then(text => {
          this.setState(state => ({
            text: [
              ...state.text,
              text,
            ],
          }));
        });
    });
  };

  componentDidMount() {
    this.fetchMD();
  }

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        <div className="wrapper" style={{ marginTop: 50 }}>
          {this.state.text.map((text, index) => (
            <div className={classes.md}>
              <MarkdownRender markdownString={text} key={index} />
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}

Test.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Test);
