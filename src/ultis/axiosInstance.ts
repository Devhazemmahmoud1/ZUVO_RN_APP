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
});

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// Get token from AsyncStorage
const getAccessToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

// // Get refresh token from AsyncStorage
// const getRefreshToken = async () => {
//   return await AsyncStorage.getItem('refreshToken');
// };

// // Save new token
// const saveAccessToken = async (token: string) => {
//   await AsyncStorage.setItem('accessToken', token);
// };

// Function to refresh token
// const refreshToken = async () => {
//   console.log('refreshing token')
//   const keys = await AsyncStorage.getAllKeys();
//     const result = await AsyncStorage.multiGet(keys);
//     console.log('resultssss', result)
//   const refresh = await getRefreshToken();
//   console.log('this is the refresh', refresh)
//   try {
//     const response = await axiosInstance.post(`/api/auth/refresh-tokens`, null, {
//       headers: {
//         refresh_token: refresh
//       }
//     });

//     console.log('Responses', response)

//     const newAccessToken = response.data.accessToken;
//     await saveAccessToken(newAccessToken);

//     console.log(newAccessToken)

//     return newAccessToken;
//   } catch (err) {
//     // Optional: log out the user
//     await AsyncStorage.removeItem('accessToken');
//     await AsyncStorage.removeItem('refreshToken');
//     throw new Error('Session expired');
//   }
// };

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken(); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
  (err) => {
    const t = Date.now() - ((err.config as any)?._ts ?? Date.now());
    try { console.log("[HTTP] xx", axios.getUri(err.config), `${t}ms`); } catch {}
    console.log("[HTTP] error:", err?.message);
    return Promise.reject(err);
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
