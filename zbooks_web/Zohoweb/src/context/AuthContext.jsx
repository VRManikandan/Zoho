import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, refreshToken } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState({
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token')
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          // Verify token and get user info
          const userInfo = await getUserInfo(accessToken);
          setUser(userInfo);
        } catch (error) {
          // Token expired, try to refresh
          try {
            const refreshTokenValue = localStorage.getItem('refresh_token');
            if (refreshTokenValue) {
              const newTokens = await refreshToken(refreshTokenValue);
              setTokens(newTokens);
              localStorage.setItem('access_token', newTokens.access);
              localStorage.setItem('refresh_token', newTokens.refresh);
              
              const userInfo = await getUserInfo(newTokens.access);
              setUser(userInfo);
            }
          } catch (refreshError) {
            // Both tokens failed, logout
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const getUserInfo = async (token) => {
    // This would typically call your API to get user info
    // For now, return a mock user
    return {
      id: 1,
      email: 'admin@zbooks.com',
      full_name: 'Admin User',
      role: 'admin'
    };
  };

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { user: userData, tokens: newTokens } = response;
      
      setUser(userData);
      setTokens(newTokens);
      
      localStorage.setItem('access_token', newTokens.access);
      localStorage.setItem('refresh_token', newTokens.refresh);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const { user: newUser, tokens: newTokens } = response;
      
      setUser(newUser);
      setTokens(newTokens);
      
      localStorage.setItem('access_token', newTokens.access);
      localStorage.setItem('refresh_token', newTokens.refresh);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setTokens({ access: null, refresh: null });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
