import React from 'react';
import Layout from '../../Layout';
import Progress from '../Progress';

class Test extends React.Component {
  state = {
    status: 'idle',
  };

  handleClick = () => {
    setTimeout(() => {
      console.log('status: loading');
      this.setState({ status: 'loading' });
    }, 0e3);
    setTimeout(() => {
      console.log('status: error');
      this.setState({ status: 'error' });
    }, 4e3);

    setTimeout(() => {
      console.log('status: loading');
      this.setState({ status: 'loading' });
    }, 9e3);
    setTimeout(() => {
      console.log('status: success');
      this.setState({ status: 'success' });
    }, 13e3);
  }

  render() {
    return (
      <Layout>
        <div id="container">
          <div className="status wrapper">
            <Progress status={this.state.status} handle={this.handleClick}/>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Test;
