import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { apiBaseURL } from '../api/apiBaseURL.js';
import { AuthContext } from './authContext.js';

const authAxios = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(null);
  const refreshInFlight = useRef(null);

  const setAuth = useCallback((token, userData) => {
    setAccessToken(token);
    accessTokenRef.current = token;
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    accessTokenRef.current = null;
    setUser(null);
  }, []);

  //It loads refresh token to setAuth()
  const silentRefresh = useCallback(async () => {
    if (!refreshInFlight.current) {
      refreshInFlight.current = (async () => {
        try {
          const res = await authAxios.post('auth/refresh');
          setAuth(res.data.accessToken, res.data.user);
          return res.data.accessToken;
        } catch {
          clearAuth();
          return null;
        } finally {
          refreshInFlight.current = null;
        }
      })();
    }
    return refreshInFlight.current;
  }, [setAuth, clearAuth]);

  useEffect(() => {
    void Promise.resolve().then(() =>
      void silentRefresh().finally(() => setLoading(false)),
    );
  }, [silentRefresh]);

  const login = useCallback((token, userData) => {
    setAuth(token, userData);
  }, [setAuth]);

  const logout = useCallback(async () => {
    await authAxios.post('auth/logout').catch(() => {});
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      accessTokenRef,
      loading,
      login,
      logout,
      silentRefresh,
      isAuthenticated: !!accessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};