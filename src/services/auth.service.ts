import { useAuthStore } from "@/stores/auth.store";
import api from "./api";
import { useUserStore } from "@/stores/useUserStore";
import { useItemStore } from "@/stores/item.store";
import { useListStore } from "@/stores/lists.store";
import { disconnectSockets } from "@/lib/socket";

interface LoginPayload {
  email: string,
  password: string
}

interface RegisterPayload {
  email: string,
  name: string,
  password: string
}

export const authService = {
  me: async () => {
    const { data } = await api.get(
      '/auth/me',
      {withCredentials: true}
    )
    return data
  },

  login: async(data: LoginPayload) => {
    try {
      const res = await api.post(
        "/auth/login",
        data,
        { withCredentials: true}
      )
      return res.data
    } catch (err) {
      throw err
    }
  },

  register: async(data: RegisterPayload) => {
    const res = await api.post(
      "/auth/register",
      data,
      { withCredentials: true}
    )
    return res.data
  },

  refresh: async () => {
    const res = await api.post(
      "/auth/refresh",
      {},
      { withCredentials: true}
    )
    return res.data
  },

  logout: async () => {
    await api.post(
      "/auth/logout",
      {},
      { withCredentials: true}
    )
    delete api.defaults.headers.common.Authorization;
    useAuthStore.getState().logout()
    useUserStore.getState().reset()
    useItemStore.getState().reset()
    useListStore.getState().reset()
    disconnectSockets()  
    
    return true
  }
}