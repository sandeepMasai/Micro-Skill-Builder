
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../Api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set token on API if exists
  const setAuthHeader = (token) => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setAuthHeader(token);

        try {
          const res = await API.get('/users/me');
          setUser(res.data); 
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setUser(null);
          setAuthHeader(null);
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const token = res.data.token;

      localStorage.setItem('token', token);
      setAuthHeader(token);

      // Fetch user details after login
      const userRes = await API.get('/users/me');
      setUser(userRes.data);

      return { success: true, message: res.data.message };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password, role });

      return {
        success: true,
        message: res.data.message || 'Registration successful. Please log in.',
      };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthHeader(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
