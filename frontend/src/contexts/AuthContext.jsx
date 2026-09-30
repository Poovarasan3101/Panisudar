import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, role, fullName, photo }
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session on mount & sync fresh info from backend if token exists
  useEffect(() => {
    async function initAuth() {
      const stored = authService.getCurrentUser();
      const token = localStorage.getItem('access_token');
      if (stored) {
        setUser(stored);
      }
      if (token) {
        try {
          const freshUser = await authService.getMe();
          if (freshUser) {
            setUser(freshUser);
            authService.saveCurrentUser(freshUser);
          }
        } catch {
          // If token expired or invalid, keep stored or clear
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.getMe();
      if (freshUser) {
        setUser(freshUser);
        authService.saveCurrentUser(freshUser);
        return freshUser;
      }
    } catch (err) {
      console.warn('Failed to refresh user', err);
    }
  }, []);

  const updateUserPhoto = useCallback((photoUrl) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, photo: photoUrl };
      authService.saveCurrentUser(updated);
      return updated;
    });
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      authService.saveCurrentUser(updated);
      return updated;
    });
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError(null);
    const data = await authService.login(credentials);
    authService.saveCurrentUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (values) => {
    setAuthError(null);
    const data = await authService.register(values);
    authService.saveCurrentUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const isSeeker = user?.role === 'job_seeker';
  const isEmployer = user?.role === 'employer';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setAuthError,
        isAuthenticated,
        isSeeker,
        isEmployer,
        login,
        register,
        logout,
        refreshUser,
        updateUserPhoto,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
