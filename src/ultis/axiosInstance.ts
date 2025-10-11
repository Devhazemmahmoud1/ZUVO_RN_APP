// utils/axiosInstance.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs'
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
      ios: 'http://localhost:4000',   // iOS simulator -> Mac host
      android: 'http://10.0.2.2:4000' // Android emulator -> Mac host
})! // change this

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  },
  headers: {
    'Content-Type': 'application/json',
  } ,
  // if backend also sets httpOnly cookies, include them; harmless otherwise
  withCredentials: true,
});

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// Get token from AsyncStorage
const getAccessToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

// Get refresh token from AsyncStorage
const getRefreshToken = async () => {

  console.log('Storage tokens', await AsyncStorage.getAllKeys())

  return await AsyncStorage.getItem('refreshToken');
};

// Persist new tokens (and keep user object in sync if present)
const saveTokens = async (accessToken: string, refreshToken?: string) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);

  // Keep stored user payload in sync if it exists
  try {
    const raw = await AsyncStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const next = {
        ...parsed,
        access_token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      };
      await AsyncStorage.setItem('user', JSON.stringify(next));
    }
  } catch {}
};

// In-flight refresh coordination
let isRefreshing = false;
let refreshPromise: any = null;
type QueueItem = { resolve: (token: string) => void; reject: (err: any) => void };
const refreshQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null) => {
  while (refreshQueue.length) {
    const p = refreshQueue.shift()!;
    if (error || !token) p.reject(error || new Error('No token'));
    else p.resolve(token);
  }
};

// Optional external auth failure hook (set by AuthContext)
let onAuthFailed: null | (() => void) = null;
export const setAuthFailedHandler = (cb: null | (() => void)) => {
  onAuthFailed = cb;
};

// Call backend to refresh tokens
const performTokenRefresh = async (): Promise<string | null> => {
  const currentRefresh = await getRefreshToken();

  console.log('current refresh', currentRefresh);

  if (!currentRefresh) return null;

  console.log('perform token passed')

  try {
    // Use bare axios to avoid interceptor recursion
    let res;
    try {
      res = await axios.post(
        `${BASE_URL}/refresh-token`,
        null,
        {
          headers: {
            'x-refresh-token': currentRefresh,
            'refresh_token': currentRefresh,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          withCredentials: true,
        }
      );
    } catch (primaryErr) {
      // Optional fallback if your API uses a different path
      res = await axios.post(
        `${BASE_URL}/api/auth/refresh-tokens`,
        null,
        {
          headers: {
            'x-refresh-token': currentRefresh,
            'refresh_token': currentRefresh,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          withCredentials: true,
        }
      );
    }

    const payload = res?.data ?? {};
    // Support both snake_case and camelCase from backend
    const newAccess: string | undefined = payload?.access_token || payload?.accessToken || payload?.data?.access_token || payload?.data?.accessToken;
    const newRefresh: string | undefined = payload?.refresh_token || payload?.refreshToken || payload?.data?.refresh_token || payload?.data?.refreshToken;

    console.log('this is the new AccessToken ----->',newAccess )

    if (!newAccess) return null;

    console.log('a', newAccess)
    console.log('a', newRefresh)

    await saveTokens(newAccess, newRefresh);

    // Update defaults so subsequent requests pick up the new token
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
    return newAccess;
  } catch (err) {
    // Clear tokens on hard failure; app can redirect to login
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    try { onAuthFailed?.(); } catch {}
    return null;
  }
};

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken(); 
    console.log('this is token', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // If no access token but a refresh token exists, try pre-refresh before sending
    const url = (config.url || '').toString();
    const isRefreshCall = url.includes('/refresh-token') || url.includes('/api/auth/refresh-tokens');
    const refreshTok = await getRefreshToken();
    if (!isRefreshCall && refreshTok) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken: string) => {
              config.headers = config.headers || {};
              (config.headers as any).Authorization = `Bearer ${newToken}`;
              resolve(config);
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      const newToken = await performTokenRefresh();
      isRefreshing = false;
      if (newToken) {
        processQueue(null, newToken);
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${newToken}`;
      } else {
        processQueue(new Error('Unable to refresh token'), null);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.request.use((config) => {
  (config as any)._ts = Date.now();
  console.log("[HTTP] ->", axios.getUri(config));
  return config;
});
axiosInstance.interceptors.response.use(
  (res) => {
    const t = Date.now() - ((res.config as any)?._ts ?? Date.now());
    console.log("[HTTP] <-", res.status, axios.getUri(res.config), `${t}ms`);
    return res;
  },
  async (error) => {
    const { response, config } = error || {};
    const status = response?.status;
    const originalRequest = config || {};
    const took = Date.now() - ((originalRequest as any)?._ts ?? Date.now());
    try { console.log("[HTTP] xx", axios.getUri(originalRequest), `${took}ms`); } catch {}
    console.log("[HTTP] error:", error?.message);

    // If server says refresh is not allowed, clear and bail
    if (status === 401 && response?.data?.require_refresh === false) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      try { onAuthFailed?.(); } catch {}
      return Promise.reject(error);
    }

    // Only handle 401 once per request
    if (status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      if (isRefreshing) {
        // Queue and wait for the in-flight refresh to finish
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              (originalRequest.headers = originalRequest.headers || {});
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      refreshPromise = performTokenRefresh();
      const newToken = await refreshPromise;

      console.log('this is the refreshing', newToken)

      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        processQueue(null, newToken);
        (originalRequest.headers = originalRequest.headers || {});
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        processQueue(new Error('Unable to refresh token'), null);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
        try { onAuthFailed?.(); } catch {}
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor to handle 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log(error)
//     console.log(error.message)
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log('this is unAuthorized')
//       originalRequest._retry = true;

//       try {
//         const newToken = await refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         const newReq = axiosInstance(originalRequest);
//         console.log(newReq)
//         return newReq;
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
