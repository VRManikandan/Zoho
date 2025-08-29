import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, refreshToken, logoutUser, switchOrganization } from '../api/auth';

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
  const [currentOrganization, setCurrentOrganization] = useState(null);
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
          setCurrentOrganization(userInfo.current_organization);
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
              setCurrentOrganization(userInfo.current_organization);
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
    try {
      const response = await fetch('http://localhost:8000/api/auth/me/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { user: userData, tokens: newTokens } = response;
      
      setUser(userData);
      setCurrentOrganization(userData.current_organization);
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
      setCurrentOrganization(newUser.current_organization);
      setTokens(newTokens);
      
      localStorage.setItem('access_token', newTokens.access);
      localStorage.setItem('refresh_token', newTokens.refresh);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setCurrentOrganization(null);
      setTokens({ access: null, refresh: null });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const switchOrg = async (organizationId) => {
    try {
      const response = await switchOrganization(organizationId);
      setCurrentOrganization(response.current_organization);
      
      // Refresh user data to get updated organization info
      const userInfo = await getUserInfo(tokens.access);
      setUser(userInfo);
      
      return { success: true, organization: response.current_organization };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithOTP = async (tokens, userData) => {
    setUser(userData);
    setTokens(tokens);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  };

  const value = {
    user,
    currentOrganization,
    tokens,
    loading,
    login,
    register,
    logout,
    loginWithOTP,
    switchOrganization: switchOrg,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
