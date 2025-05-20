import ky from 'ky';
import { API_PATHS } from './api/api-paths';

const PUBLIC_ROUTES = [
  API_PATHS.AUTH.LOGIN,
  API_PATHS.AUTH.REGISTER,
  API_PATHS.AUTH.FORGOT_PASSWORD,
  API_PATHS.AUTH.RESET_PASSWORD,
] as const;

const isPublicRoute = (url: string) => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

const getAuthData = () => {
  const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  return authData?.state?.token || '';
};

export let kyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      request => {
        const token = getAuthData();
        const url = request.url;

        if (token && !isPublicRoute(url)) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});

export const pushTokenToHeader = (token: string) => {
  kyInstance = kyInstance.extend({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeTokenFromHeader = () => {
  kyInstance = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  });
};
