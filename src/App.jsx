import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

import { Provider } from 'react-redux';
import store from './store';

import Home from './Views/Home';
import Topic from './Views/Topic';
import User from './Views/User';
import Signin from './Views/Signin';
import Message from './Views/Message';
import Settings from './Views/Settings';
import NotFound from './Views/404';
import Test from './Views/Test';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthed } = store.getState().auth;

  return (
    <Route
      {...rest}
      render={props => (
        isAuthed ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
  );
};

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/topic/:topic_id" component={Topic} />
              <Route exact path="/user/:uname" component={User} />
              <Route exact path="/signin/" component={Signin} />
              <PrivateRoute exact path="/message/" component={Message} />
              <Route exact path="/settings/" component={Settings} />
              <Route exact path="/test/" component={Test} />
              <Route path="*" component={NotFound} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
