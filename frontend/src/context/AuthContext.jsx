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
      console.log('Auth response:', response.data); // ← Add this for debugging
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check error:', error); // ← Add this for debugging
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      await authAPI.getCsrfToken();
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      return { 
        success: true,
        user: response.data.user,
        message: 'Login successful'
      };
    } catch (error) {
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
      
      console.log('API Response:', response);
      console.log('Response Data:', response.data);
      
      // Make sure to return the actual data from the response
      return { 
        success: true, 
        message: response.data?.message || 'Registration successful!',
        user: response.data?.user || null
      };
    } catch (error) {
      console.log('Registration Error:', error);
      console.log('Error response:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.getCsrfToken(); // <-- fetch CSRF token first
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
