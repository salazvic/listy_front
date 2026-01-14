import { create } from "zustand";

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  access_token: string | null
  isAuthenticated: boolean
  hasLoggedIn: boolean

  setAuth: (user: User) => void
  setAccess_token: (token: string) => void
  logout: () => void,
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  access_token: null,
  isAuthenticated: false,
  hasLoggedIn: false,

  setAuth: (user) => 
    set({
      user,    
      isAuthenticated: true,
      hasLoggedIn: true
    }),
  
  setAccess_token(token) {
    set({
      access_token: token
    })
  },

  logout: () => 
    set({
      user: null,
      access_token: null,
      isAuthenticated: false
    })
}))