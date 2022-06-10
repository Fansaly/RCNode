import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { AXIOS_CONFIG } from '@/config';

const configurator = (config: AxiosRequestConfig) => {
  const { headers } = config;
  return { ...config, headers };
};

const createInstance = (config: AxiosRequestConfig) => {
  const instance: AxiosInstance = axios.create(config);

  instance.interceptors.request.use(
    (config) => configurator(config),
    (error) => error,
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return instance;
};

const timeout = AXIOS_CONFIG.timeout;
const baseURL = AXIOS_CONFIG.baseURL;
const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
};

export const request = createInstance({
  timeout,
  baseURL,
  headers,
});

export const fetch = async <D = any, T = Record<string, any>>(
  options: AxiosRequestConfig,
): Promise<
  {
    [K in keyof T]?: T[K];
  } & {
    success: boolean;
    err_msg?: string;
    data?: D;
  }
> => {
  try {
    const { data } = await request(options);
    return { ...data, success: true };
  } catch (error: any) {
    if (error.name === 'CanceledError') {
      return Object.assign({ success: false });
    }

    if (!error.response) {
      return Object.assign({ success: false, err_msg: 'Fatal Error' });
    }

    const { config, status, data } = error.response;
    let err_msg: string = data?.error_msg;

    if (!err_msg && import.meta.env.DEV) {
      err_msg = `${status} => ${config.url}`;
    }

    return Object.assign({ success: false, err_msg });
  }
};
