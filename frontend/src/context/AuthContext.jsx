import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";   // ✅ FIXED
import api from "../api/axios";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Store refresh token
  const storeRefresh = (token) => {
    if (token) localStorage.setItem("devnest_refresh", token);
    else localStorage.removeItem("devnest_refresh");
  };

  const getStoredRefresh = () => localStorage.getItem("devnest_refresh");

  // login
  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });

    const { access_token, refresh_token } = res.data;

    setAccessToken(access_token);
    storeRefresh(refresh_token);

    const decoded = jwtDecode(access_token); // ✅ FIXED

    setUser({ uid: decoded.sub, role: decoded.role });

    return res;
  };

  // signup
  const signup = async (payload) => {
    return authApi.signup(payload);
  };

  // logout
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    storeRefresh(null);
  };

  // refresh access token
  const refresh = async () => {
    const refresh_token = getStoredRefresh();
    if (!refresh_token) throw new Error("No refresh token");

    const res = await authApi.refreshToken(refresh_token);

    const { access_token, refresh_token: new_refresh } = res.data;

    setAccessToken(access_token);
    storeRefresh(new_refresh);

    const decoded = jwtDecode(access_token); // ✅ FIXED
    setUser({ uid: decoded.sub, role: decoded.role });

    return access_token;
  };

  // Restore session on first load
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const refresh_token = getStoredRefresh();
        if (refresh_token) {
          await refresh();
        }
      } catch (e) {
        console.log("Session restore failed:", e.message || e);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  // Axios interceptors
  useEffect(() => {
    const addAuthHeader = (config) => {
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    };

    let isRefreshing = false;
    let queue = [];

    const processQueue = (err, token = null) => {
      queue.forEach((p) => {
        if (err) p.reject(err);
        else p.resolve(token);
      });
      queue = [];
    };

    const resInterceptor = async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refresh();

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    };

    const reqInterceptor = api.interceptors.request.use(addAuthHeader, (err) => Promise.reject(err));
    const respInterceptor = api.interceptors.response.use((r) => r, resInterceptor);

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(respInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        signup,
        refresh,
        loadingSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
