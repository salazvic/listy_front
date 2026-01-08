import { create } from 'zustand'

type AllUSers = {
  id: string
  name: string
  email: string
}

const initialState = {
  users: [],
}

interface UserState {
  users: AllUSers[]

  setAllUsers: (users: AllUSers[]) => void
  addUser: (user: AllUSers) => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setAllUsers: (users) => {
    set(() => ({ users }))
  },

  addUser: (user) => {
    set((state) => ({
      users: [...state.users, user]
    }))
  },

  reset: () => set(initialState),
}))