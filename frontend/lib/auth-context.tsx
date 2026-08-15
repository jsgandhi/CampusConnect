'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'FACULTY';
  avatarUrl?: string;
  studentId?: string;
  major?: string;
  term?: string;
  gpa?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const STORAGE_USER_KEY = 'campusconnect_user';
export const STORAGE_TOKEN_KEY = 'campusconnect_token';

/**
 * Real (for-demo-purposes) session state, backed by the actual logged-in
 * user returned from POST /api/v1/auth/login — not a fake persona picked
 * from a hardcoded array. Persisted to localStorage so a refresh doesn't
 * sign you out; api-client.ts reads the same storage keys to attach the
 * signed-in user's id/role to every backend request.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch (_err) {
      // Corrupted localStorage — treat as logged out rather than crashing.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newUser: AuthUser, newToken: string) => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    setUser(newUser);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * Convenience hook for protected pages: redirects to /login once we know
 * for certain there's no signed-in user (after the initial localStorage
 * read completes, to avoid a flash-redirect on first paint).
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  return { user, isLoading };
}
