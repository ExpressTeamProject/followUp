import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResAuthUser } from '@/types/common';
import { pushTokenToHeader, removeTokenFromHeader } from '@/lib/kyInstance';

interface AuthState {
  token: string;
  user: ResAuthUser | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUser: (user: ResAuthUser | null) => void;
  login: (token: string, user: ResAuthUser) => void;
  logout: () => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: '',
  user: null,
  isAuthenticated: false,
};

const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...initialState,

      setToken: (token: string) => {
        pushTokenToHeader(token);
        set(state => ({
          ...state,
          token,
          isAuthenticated: !!token,
        }));
      },

      setUser: (user: ResAuthUser | null) =>
        set(state => ({
          ...state,
          user,
          isAuthenticated: !!user && !!state.token,
        })),

      login: (token: string, user: ResAuthUser) => {
        pushTokenToHeader(token);
        set(() => ({
          token,
          user,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        removeTokenFromHeader();
        set(initialState);
      },

      clearAuth: () => {
        removeTokenFromHeader();
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
