import { create } from "zustand";

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string | null, refresh: string | null) => void
  setAccess_token: (token: string) => void
  setTokens: (a: string | null, r: string | null) => void
  logout: () => void,
  hasLoggedIn: boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  access_token: null,
  refresh_token: null,
  isAuthenticated: false,
  hasLoggedIn: false,

  setAuth: (user, access, refresh) => 
    set({
      user,
      access_token: access,
      refresh_token: refresh,      
      isAuthenticated: true,
      hasLoggedIn: true
    }),
  
  setAccess_token(token) {
    set({
      access_token: token
    })
  },

  setTokens: (access, refresh) => ({
    access_token: access,
    refresh_token: refresh
  }),
  
  logout: () => 
    set({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false
    })
}))