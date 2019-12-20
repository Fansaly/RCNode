import axios from 'axios';
import { getBingImage } from './getBingImage';

const cnodeAxios = axios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  timeout: 3000,
});

/**
 * @param {string} url
 * @param {string} method
 * @param {object} params
 */
const fetch = async ({ url, method = 'GET', params = {} }) => {
  params = method === 'GET' ? { params } : { data: params };

  try {
    const { data } = await cnodeAxios({ method, url, ...params });

    return {
      success: true,
      data: method === 'GET' ? data.data : data,
    };

  } catch ({ response }) {
    if (!Boolean(response)) {
      return {
        success: false,
        err_msg: '发生异常',
      };
    }

    const { status, data: { error_msg = '' } } = response;

    return {
      success: false,
      err_msg: !Boolean(error_msg) && process.env.NODE_ENV === 'development'
               ? `${status} => ${url}`
               : error_msg,
    };
  }
};

const get = async ({ url, params }) => {
  return await fetch({ method: 'GET', url, params });
};

const post = async ({ url, params }) => {
  return await fetch({ method: 'POST', url, params });
};

export {
  get,
  post,
  getBingImage,
};
