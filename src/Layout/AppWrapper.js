import PropTypes from 'prop-types';

import { useChangeApp } from './AppFrame';

const AppWrapper = (props) => {
  const changeApp = useChangeApp();
  const {
    title,
    htmlAttributes,
    bodyAttributes,
    withHeader = true,
    reset = false,
  } = props;

  changeApp({
    title,
    htmlAttributes,
    bodyAttributes,
    withHeader,
    reset,
  });

  return props.children;
};

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  htmlAttributes: PropTypes.object,
  bodyAttributes: PropTypes.object,
  withHeader: PropTypes.bool,
  reset: PropTypes.bool,
};

export default AppWrapper;
