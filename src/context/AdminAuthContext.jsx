import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/adminaxios';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  // Verify token and fetch profile on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/api/admin/me');
          if (res.data && res.data.success && res.data.data) {
            const user = res.data.data;
            if (user.role === 'admin') {
              setAdmin(user);
            } else {
              toast.error('Access Denied: Admin privileges required.');
              performLogout();
            }
          } else if (res.data && res.data.role === 'admin') {
            // Handle case where API returns user directly
            setAdmin(res.data);
          } else {
            performLogout();
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          performLogout();
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/admin/login', { email, password });
      
      if (res.data && res.data.success && res.data.data) {
        const { token: userToken, user } = res.data.data;
        
        if (user.role !== 'admin') {
          toast.error('Access Denied: Only administrators can log in.');
          return false;
        }

        localStorage.setItem('admin_token', userToken);
        setToken(userToken);
        setAdmin(user);
        toast.success(`Access Granted. Welcome, ${user.name}!`);
        return true;
      } else if (res.data && res.data.token && res.data.user) {
        // Handle case where API returns data directly
        const { token: userToken, user } = res.data;
        
        if (user.role !== 'admin') {
          toast.error('Access Denied: Only administrators can log in.');
          return false;
        }

        localStorage.setItem('admin_token', userToken);
        setToken(userToken);
        setAdmin(user);
        toast.success(`Access Granted. Welcome, ${user.name}!`);
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(message);
      return false;
    }
  };

  const performLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  const logout = () => {
    performLogout();
    toast.success('Logged out successfully.');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
