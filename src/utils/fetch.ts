import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';

import { AXIOS_CONFIG } from '@/config';

const configurator = (config: AxiosRequestConfig) => {
  const { headers } = config;
  return { ...config, headers } as InternalAxiosRequestConfig;
};

const createInstance = (config: AxiosRequestConfig) => {
  const instance = axios.create(config);

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
const headers: RawAxiosRequestHeaders = {
  'Content-Type': 'application/json;charset=UTF-8',
};

export const request = createInstance({
  timeout,
  baseURL,
  headers,
});

interface ResponseData {
  success: boolean;
  err_msg?: string;
  data?: any;
}

export const fetch = async <T = Record<string, never>>(
  options: AxiosRequestConfig,
): Promise<Partial<T> & Omit<ResponseData, keyof T>> => {
  try {
    const { data } = await request(options);
    return { ...data, success: true };
  } catch (error: any) {
    if (error.name === 'CanceledError') {
      return Object.assign({ success: false });
    }

    if (!error.response) {
      return Object.assign({ success: false, err_msg: 'FATAL ERROR' });
    }

    const { config, status, data } = error.response;
    let err_msg: string = data?.error_msg;

    if (!err_msg && import.meta.env.DEV) {
      err_msg = `${status} => ${config.url}`;
    }

    return Object.assign({ success: false, err_msg });
  }
};
