import axios from 'axios';
import { getBingImage } from './getBingImage';

axios.defaults.baseURL = 'https://cnodejs.org/api/v1';

/**
 * @param {string} url
 * @param {object} params
 */
const get = ({ url, params = {} }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then(({ data }) => {
        resolve({
          success: true,
          ...data,
        });
      }, (err) => {
        resolve({
          success: false,
          err_msg: `failed. target => ${url}`,
        });
      });
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
const post = ({ url, params = {} }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, { ...params })
      .then(({ data }) => {
        resolve({
          success: true,
          data,
        });
      }, ({ config, request, response }) => {
        const { status, data } = response;
        const result = {
          success: false,
          err_msg: status === 401 || status === 403
                   ? data.error_msg
                   : process.env.NODE_ENV === 'development'
                     ? `${status}. URL ${url}`
                     : '',
        };
        resolve(result);
      });
  });
};

export {
  get,
  post,
  getBingImage,
};
