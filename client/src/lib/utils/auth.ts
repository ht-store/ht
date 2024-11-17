export const AUTH_KEY = {
  TOKEN: 'mpl_app_token',
  REFRESH_TOKEN: 'mpl_app_refresh_token',
};

export const setToken = (token: string) => localStorage.setItem(AUTH_KEY.TOKEN, token);

export const getToken = () => localStorage.getItem(AUTH_KEY.TOKEN);

export const removeToken = () => localStorage.removeItem(AUTH_KEY.TOKEN);

export const setRefreshToken = (token: string) => localStorage.setItem(AUTH_KEY.REFRESH_TOKEN, token);

export const getRefreshToken = () => localStorage.getItem(AUTH_KEY.REFRESH_TOKEN);

export const removeRefreshToken = () => localStorage.removeItem(AUTH_KEY.REFRESH_TOKEN);

export const setTokens = (token: string, refreshToken: string) => {
  setToken(token);
  setRefreshToken(refreshToken);
}

export const removeTokens = () => {
  removeToken();
  removeRefreshToken();
};
