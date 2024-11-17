import request from '@/lib/utils/axios';
import { AxiosResponse } from 'axios';

export const register = async (params: any): Promise<AxiosResponse> => request.post(`/auth/register`, params);

export const login = async (body: { email: string, password: string }): Promise<AxiosResponse> =>
  request.post(`/auth/login`, body);

export const getCurrentUser = async (): Promise<AxiosResponse> => request.get(`/auth/me`);

export const refresh = async (refreshToken: string): Promise<AxiosResponse> =>
  request.get(`/auth/refresh-token`, {
    params: { refresh_token: refreshToken },

    // Disable retry on token refreshing request
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _unretryable: true,
  });

export const logout = async (): Promise<AxiosResponse> => request.get(`/api/v1/auth/sign-out`);

export const jarvisLogin = async (body: { token: string }): Promise<AxiosResponse> =>
  request.post(`/api/v1/auth/external-sign-in`, body);
