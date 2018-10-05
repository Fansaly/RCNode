import React from 'react';
import Layout from '../../Layout';
import './settings.styl';

class Settings extends React.Component {
  render() {
    return (
      <Layout>
        <div className="wrapper">
          <div style={{ marginTop: '50px' }}>
            <h1>Settings.</h1>
            <hr />
          </div>
        </div>
      </Layout>
    );
  }
}

export default Settings;
