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
  setAuth: (user: User, token: string | null) => void
  setAccess_token: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  access_token: null,
  isAuthenticated: false,

  setAuth: (user, token) => 
    set({
      user,
      access_token: token,
      isAuthenticated: true
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