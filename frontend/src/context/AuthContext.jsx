import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data.user || response.data); // Handle both response formats
      return response.data.user || response.data;
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Get CSRF cookie first
      await authAPI.getCsrfToken();
      
      // Make login request
      const response = await authAPI.login(credentials);
      
      // Get user data after successful login
      const userData = await checkAuthStatus();
      
      return { 
        success: true,
        user: userData,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error details:', error.response);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.getCsrfToken();
      const response = await authAPI.register(userData);

      // Get user data after successful registration
      const registeredUser = await checkAuthStatus();

      return { 
        success: true, 
        user: registeredUser,
        message: 'Registration successful!'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.getCsrfToken();
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};