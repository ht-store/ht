import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { appConfigs } from '../app-config';

import { getRefreshToken, getToken, removeTokens, setTokens } from './auth';
import { refresh } from '@/services/auth';

const instance = axios.create({
  baseURL: `${appConfigs.apiURL}`,
});

const requestAuthInterceptor = (req: AxiosRequestConfig): InternalAxiosRequestConfig => {
  // if (req.url?.includes('/auth/refresh')) {
  //   return req as InternalAxiosRequestConfig;
  // }

  const token = getToken();

  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders,
    };
  }

  return req as InternalAxiosRequestConfig;
};

const responseAuthInterceptor = (res: AxiosResponse) => res;

const responseAuthErrorInterceptor = async (error: AxiosError) => {
  const { response, config } = error;
  const status = response?.status;

  // NOTE: Config may include the `_unretryable` property, which was passed via Axios request.
  if (status === HttpStatusCode.Unauthorized && !(config as any)._unretryable) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        const refreshResponse = await refresh(refreshToken);

        const { access_token: _accessToken, refresh_token: _refreshToken } = refreshResponse.data.data;
        if (_accessToken && _refreshToken) {
          setTokens(_accessToken, _refreshToken);

          // Prevent infinite loop on the resumed request
          (config as any)._unretryable = true;
          return await instance(config!);
        }
      } catch (refreshError) {
        removeTokens();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
  }

  return Promise.reject(error);
};

instance.interceptors.request.use(requestAuthInterceptor);
instance.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default instance;
