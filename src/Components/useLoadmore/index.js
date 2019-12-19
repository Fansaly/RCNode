import React from 'react';

const useLoadmore = (options = {}) => {
  const [loadmore, setLoadmore] = React.useState(false);

  React.useEffect(() => {
    const { threshold = 20 } = options;

    const handleScroll = () => {
      const documentHeight = document.documentElement.offsetHeight || document.body.offsetHeight;
      const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;

      if (documentHeight > windowHeight && documentHeight - (windowHeight + scrollHeight) <= threshold) {
        setLoadmore(true);
      } else {
        setLoadmore(false);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [options]);

  return loadmore;
};

export default useLoadmore;
