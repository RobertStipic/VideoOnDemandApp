import axios from "axios";

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh") &&
      !originalRequest.url.includes("/users/login")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            "/users/refresh",
            {},
            { withCredentials: true },
          );
        }

        const refreshRes = await refreshPromise;
        refreshPromise = null;

        const newToken = refreshRes.data.accessToken;
        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/user/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
