import React from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';

import {
  changeTitle,
  changeHtmlAttributes,
  changeBodyAttributes,
} from './Helper';
import Header from './Header';
import Notice from './Notice';
import './app.styl';

const initialOptions = {
  title: 'RCNode',
  htmlAttributes: null,
  bodyAttributes: null,
  withHeader: true,
};

const AppFrameContext = React.createContext(null);

const AppFrame = (props) => {
  const [options, dispatch] = React.useReducer((state, { type, payload }) => {
    switch (type) {
      case 'CHANGE':
        return {
          ...state,
          title: payload.title || state.title,
          htmlAttributes: payload.htmlAttributes,
          bodyAttributes: payload.bodyAttributes,
          withHeader: payload.withHeader,
        };
      case 'RESET':
        return {
          ...initialOptions,
        };
      default:
        throw new Error(`Unrecognized type ${type}`);
    }
  }, initialOptions);

  const { title, htmlAttributes, bodyAttributes, withHeader } = options;

  React.useEffect(() => {
    changeTitle(title);
  }, [title]);

  React.useEffect(() => {
    changeHtmlAttributes(htmlAttributes);
  }, [htmlAttributes]);

  React.useEffect(() => {
    changeBodyAttributes(bodyAttributes);
  }, [bodyAttributes]);

  return (
    <AppFrameContext.Provider value={dispatch}>
      <CssBaseline />

      {withHeader && (
        <React.Fragment>
          <Header />
          <Notice />
        </React.Fragment>
      )}

      {props.children}
    </AppFrameContext.Provider>
  );
};

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppFrame;

export const useChangeApp = () => {
  const dispatch = React.useContext(AppFrameContext);

  return React.useCallback(options => {
    const type = options.reset ? 'RESET' : 'CHANGE';
    dispatch({ type, payload: options });
  }, [dispatch]);
};
