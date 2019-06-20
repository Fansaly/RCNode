import React from 'react';
import Notice from './Notice';
import Header from './Header';
import './layout.styl';

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Notice />
        <Header />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Layout;
