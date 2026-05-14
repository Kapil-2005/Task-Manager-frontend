import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const res = await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  };

  const login = async (userData) => {
    const res = await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/login', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
