// utils/apiClient.ts
import axiosInstance from './axiosInstance';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ApiRequest {
  path: string;
  method?: Method;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
  signal?: AbortSignal;
}

export const apiRequest = async <T = any>({
  path,
  method = 'get',
  headers = {},
  query,
  body,
  signal
}: ApiRequest): Promise<T> => {
  const config = {
    method,
    url: path,
    headers,
    params: query,
    data: body,
    signal
  };

  const response = await axiosInstance(config);

  console.log('API Response:', response.status, response.data);

  return response.data;
};
