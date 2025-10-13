// utils/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import { Platform } from 'react-native';

/**
 * BASE_URL:
 * - iOS simulator -> http://localhost:4000
 * - Android emulator -> http://10.0.2.2:4000
 * - Physical device: replace with your machine's LAN IP (e.g., http://192.168.1.10:4000)
 */
export const BASE_URL =
  Platform.select({
    ios: 'http://localhost:4000',
    android: 'http://10.0.2.2:4000',
  }) || 'http://10.0.2.2:4000';

// ---- Minimal helpers for storage ----
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// Persist new tokens (and keep user object in sync if present)
const saveTokens = async (accessToken: string, refreshToken?: string) => {
  await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);

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
  } catch {
    // ignore
  }
};

const clearTokens = async () => {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, 'user']);
};

const getAccessToken = async () => AsyncStorage.getItem(ACCESS_KEY);
const getRefreshToken = async () => AsyncStorage.getItem(REFRESH_KEY);

// Optional external hook (e.g., navigate to Login)
let onAuthFailed: null | (() => void) = null;
export const setAuthFailedHandler = (cb: null | (() => void)) => {
  onAuthFailed = cb;
};

// ---- Axios instance ----
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
});

// Bootstrap default Authorization header on app start
(async () => {
  const t = await getAccessToken();

  const [access, refresh, user] = await Promise.all([
  AsyncStorage.getItem('accessToken'),
  AsyncStorage.getItem('refreshToken'),
  AsyncStorage.getItem('user'),
]);
console.log('🔑 accessToken:', access);
console.log('🔁 refreshToken:', refresh);
console.log('👤 user:', user);


  if (t) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${t}`;
  }
})();

// ---- Refresh coordination (single in-flight refresh + queue) ----
let isRefreshing = false;
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};
const refreshQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null) => {
  while (refreshQueue.length) {
    const p = refreshQueue.shift()!;
    if (error || !token) p.reject(error || new Error('No token'));
    else p.resolve(token);
  }
};

const isRefreshRequest = (config?: AxiosRequestConfig): boolean => {
  const url = (config?.url || '').toString();
  return (
    url.includes('/refresh-token') || url.includes('/api/auth/refresh-tokens')
  );
};

// Actually call the backend to rotate tokens
const performTokenRefresh = async (): Promise<string | null> => {
  console.log('time to refresh tokens')
  const currentRefresh = await getRefreshToken();
  if (!currentRefresh) return null;

  try {
    // Primary refresh route
    const res = await axios.post(
      `${BASE_URL}/refresh-token`,
      { refresh_token: currentRefresh }, // send in body (most robust)
      {
        headers: {
          'x-refresh-token': currentRefresh, // also send as header (optional)
          'Content-Type': 'application/json',
        },
        timeout: 10000,
        withCredentials: true,
      },
    );

    const payload = res?.data ?? {};
    const newAccess: string | undefined =
      payload?.access_token ||
      payload?.accessToken ||
      payload?.data?.access_token ||
      payload?.data?.accessToken;

    const newRefresh: string | undefined =
      payload?.refresh_token ||
      payload?.refreshToken ||
      payload?.data?.refresh_token ||
      payload?.data?.refreshToken;

    if (!newAccess) return null;

    await saveTokens(newAccess, newRefresh);
    // Make sure subsequent requests pick the new token
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
    return newAccess;
  } catch (e1) {
    // Optional fallback if API exposes a second path
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/refresh-token`,
        { refresh_token: currentRefresh },
        {
          headers: {
            'x-refresh-token': currentRefresh,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          withCredentials: true,
        },
      );

      const payload = res?.data ?? {};
      const newAccess: string | undefined =
        payload?.access_token ||
        payload?.accessToken ||
        payload?.data?.access_token ||
        payload?.data?.accessToken;

      const newRefresh: string | undefined =
        payload?.refresh_token ||
        payload?.refreshToken ||
        payload?.data?.refresh_token ||
        payload?.data?.refreshToken;

      if (!newAccess) return null;

      await saveTokens(newAccess, newRefresh);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      return newAccess;
    } catch (e2) {
      // Refresh itself failed → wipe tokens and notify
      await clearTokens();
      try {
        onAuthFailed?.();
      } catch {}
      return null;
    }
  }
};

// ---- Interceptors ----

// Add Authorization if we have it; no pre-refresh here
axiosInstance.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    // lightweight timing/debug flag
    (config as any)._ts = Date.now();
    try {
      // eslint-disable-next-line no-console
      console.log('[HTTP] ->', axios.getUri(config));
    } catch {}
    return config;
  },
  error => Promise.reject(error),
);

// Single-path refresh on 401 responses
axiosInstance.interceptors.response.use(
  res => {
    const t = Date.now() - ((res.config as any)?._ts ?? Date.now());
    // eslint-disable-next-line no-console
    console.log('[HTTP] <-', res.status, axios.getUri(res.config), `${t}ms`);
    return res;
  },
  async (error: AxiosError) => {
    const { response, config } = error || {};
    const status = response?.status;
    const originalRequest = (config || {}) as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const took = Date.now() - ((originalRequest as any)?._ts ?? Date.now());
    try {
      // eslint-disable-next-line no-console
      console.log('[HTTP] xx', axios.getUri(originalRequest), `${took}ms`);
    } catch {}
    // eslint-disable-next-line no-console
    console.log('[HTTP] error:', error?.message);

    // If this is the refresh call itself → hard fail, clear & bubble up
    if (status === 401 && isRefreshRequest(originalRequest)) {
      await clearTokens();
      try {
        onAuthFailed?.();
      } catch {}
      return Promise.reject(error);
    }

    // Only attempt refresh once per request
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue while a refresh is in-flight
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers = originalRequest.headers || {};
              (
                originalRequest.headers as any
              ).Authorization = `Bearer ${newToken}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      // Start a new refresh
      isRefreshing = true;
      const newToken = await performTokenRefresh();
      isRefreshing = false;

      if (newToken) {
        processQueue(null, newToken);
        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        processQueue(new Error('Unable to refresh token'), null);
        // Already cleared in performTokenRefresh on failure
        return Promise.reject(error);
      }
    }

    // Not a 401 or already retried
    return Promise.reject(error);
  },
);

export default axiosInstance;
