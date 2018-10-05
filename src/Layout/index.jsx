import React from 'react';
import Header from './Header';
import './layout.styl';

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Layout;
