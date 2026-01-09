import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by verifying token
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user profile
      apiClient.get('/auth/profile')
        .then((response) => {
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password, username, firstName, lastName) => {
    try {
      const requestData = {
        email,
        password,
        username: username || email.split('@')[0],
        firstName: firstName || '',
        lastName: lastName || ''
      };
      
      const response = await apiClient.post('/auth/register', requestData);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return { data: { user: response.user }, error: null };
      }
      return { data: null, error: { message: response.message || 'Registration failed' } };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Registration failed' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return { data: { user: response.user }, error: null };
      }
      return { data: null, error: { message: response.message || 'Login failed' } };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Login failed' } };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
