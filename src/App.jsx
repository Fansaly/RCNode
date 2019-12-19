import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Provider, useSelector } from 'react-redux';
import store from './store';

import ThemeProvider from './Components/Theme';
import ScrollToTop from './Components/ScrollToTop';
import Loadding from './Components/Loadding';

import { AppFrame } from './Layout';
import Home from './Views/Home';
import Topic from './Views/Topic';
import User from './Views/User';
import Signin from './Views/Signin';
import Message from './Views/Message';
import Settings from './Views/Settings';
import NotFound from './Views/404';

let Test = NotFound;

if (process.env.NODE_ENV === 'development') {
  Test = React.lazy(() => import('./Views/Test'));
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthed } = useSelector(({ auth }) => auth);

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

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AppFrame>
            <ScrollToTop />
            <React.Suspense fallback={<Loadding />}>
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
            </React.Suspense>
          </AppFrame>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
