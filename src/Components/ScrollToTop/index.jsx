import React from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    // const element = document.querySelector('#root');
    // element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
