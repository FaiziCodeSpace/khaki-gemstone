import { createContext, useState, useEffect, useCallback } from 'react';
import adminApi from '../services/adminServices/api.authService';
import { Outlet } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useCallback to prevent the function from changing on every render
  const refresh = useCallback(async () => {
    try {
      const res = await adminApi.post('/admin/refresh-token');
      if (res.data.accessToken) {
        window.adminAccessToken = res.data.accessToken;
        setAdmin(res.data.admin);
      }
    } catch (err) {
      // 401 is expected here if not logged in. We just clear everything.
      window.adminAccessToken = null;
      setAdmin(null);
    } finally {
      setLoading(false); // This is the most important line to stop the white screen
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (credentials) => {
    const res = await adminApi.post('/admin/login', credentials);
    window.adminAccessToken = res.data.accessToken;
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = async () => {
    try {
      await adminApi.post('/admin/logout');
    } finally {
      window.adminAccessToken = null;
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {/* 2. Render children if they exist, otherwise render the Outlet */}
      {children ? children : <Outlet />}
    </AuthContext.Provider>
  );
};