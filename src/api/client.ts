import axios from "axios";
import * as SecureStore from "expo-secure-store";

// 🔧 SESUAIKAN: IP LAN laptop kamu. Jalankan Laravel: php artisan serve --host=0.0.0.0 --port=8000
export const BASE_URL = "http://192.168.1.10:8000/api";
export const TOKEN_KEY = "lsm_token";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(error);
  },
);

export const getApiError = (error: any): string => {
  const data = error?.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join("\n");
  return data?.message || error?.message || "Terjadi kesalahan jaringan.";
};
