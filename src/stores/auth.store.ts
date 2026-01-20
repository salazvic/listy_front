import { create } from "zustand";

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  hasLoggedIn: boolean

  setAuth: (user: User) => void
  logout: () => void,
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasLoggedIn: false,

  setAuth: (user) => 
    set({
      user,    
      isAuthenticated: true,
      hasLoggedIn: true
    }),

  logout: () => 
    set({
      user: null,
      isAuthenticated: false
    })
}))