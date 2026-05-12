import { backendHostURL } from '@/services/api';
import { getCurrentAccessToken } from '@/utils/cookie/CookiesInfo';
import axios, { AxiosError, AxiosInstance } from 'axios';
import * as Sentry from '@sentry/react';
import type { ApiErrorBody, ApiFieldError } from '@/shared/api/types';

// 1. Axios instance
export const apiURL: AxiosInstance = axios.create({
  baseURL: backendHostURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Attach Bearer token on every request
apiURL.interceptors.request.use((config) => {
  const token = getCurrentAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Helpers used by callers to read the server's structured error shape.
//    The new server emits { statusCode, success:false, message, errors[], data:null }.
//    These two helpers let UI code surface a human message + field-level errors
//    without re-implementing the envelope parsing each time.
export const getApiErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ApiErrorBody | undefined;
    return body?.message || err.message || 'Something went wrong';
  }
  return err instanceof Error ? err.message : 'Something went wrong';
};

export const getApiFieldErrors = (err: unknown): ApiFieldError[] => {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ApiErrorBody | undefined;
    return Array.isArray(body?.errors) ? body!.errors : [];
  }
  return [];
};

// 4. Sentry error capture with sensitive-field sanitization.
apiURL.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    Sentry.captureException(error, (scope) => {
      scope.setTag('type', 'api_error');

      const sanitize = (data: unknown): unknown => {
        if (!data) return null;
        try {
          let obj: unknown = data;
          if (typeof data === 'string') {
            try {
              obj = JSON.parse(data);
            } catch {
              return '[Raw String]';
            }
          }
          if (typeof obj !== 'object' || obj === null) return obj;

          const clone = JSON.parse(JSON.stringify(obj));
          const sensitive = [
            'password',
            'token',
            'secret',
            'credential',
            'auth',
          ];
          const mask = (o: Record<string, unknown>) => {
            for (const key in o) {
              if (sensitive.some((s) => key.toLowerCase().includes(s))) {
                o[key] = '[FILTERED]';
              } else if (typeof o[key] === 'object' && o[key] !== null) {
                mask(o[key] as Record<string, unknown>);
              }
            }
          };
          mask(clone);
          return clone;
        } catch {
          return '[Data Sanitization Failed]';
        }
      };

      if (error.config) {
        scope.setContext('request', {
          url: error.config.url,
          method: error.config.method?.toUpperCase(),
          data: sanitize(error.config.data),
        });
      }
      if (error.response) {
        scope.setContext('response', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: sanitize(error.response.data),
        });
      }
      return scope;
    });

    return Promise.reject(error);
  }
);
