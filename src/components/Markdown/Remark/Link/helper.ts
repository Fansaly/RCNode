import { cnodeURL, urlRegExp } from '@/router';

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');

const urlConvertor = (str: string) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(urlRegExp, (_: string, protocol: string, path: string) => {
    let host = cnodeURL;

    if (typeof window !== 'undefined') {
      protocol = protocol && `${window.location.protocol}//`;
      host = window.location.host;
    }

    protocol = protocol || '';

    return `${protocol}${host}${BASE_URL}${path}`;
  });
};

const textConvertor = (str: string) => {
  if (str && typeof str === 'string') {
    str = urlConvertor(str);

    if (/^\//.test(str)) {
      str = `${BASE_URL}${str}`;
    }
  }

  return str;
};

const childrenConvertor = (children: any[]) => {
  if (!Array.isArray(children)) {
    return;
  }

  for (let i = 0; i < children.length; i++) {
    if (typeof children[i] === 'string') {
      children[i] = textConvertor(children[i]);
    } else {
      childrenConvertor(children[i].props.children);
    }
  }
};

export { childrenConvertor, textConvertor, urlConvertor };
