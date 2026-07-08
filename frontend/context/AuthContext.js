'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, getToken, setToken, clearToken } from '@/lib/api';

const AuthContext = createContext(null);

// Decodes the payload of a JWT without verifying it — fine for reading
// non-sensitive claims like the user id on the client. Server still verifies.
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = decodeToken(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ id: payload.id });
      } else {
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    const token = getToken();
    const payload = token ? decodeToken(token) : null;
    setUser(payload ? { id: payload.id } : null);
    return data;
  };

  const register = async (name, email, password) => {
    return authApi.register({ name, email, password });
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
