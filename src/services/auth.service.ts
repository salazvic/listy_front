import api from "../lib/api";

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
    const { data } = await api.get('/auth/me')
    return data
  },

  login: async(payload: LoginPayload) => {
    const {data} = await api.post(
      "/auth/login",
      payload
    )
    return data
  },

  register: async(payload: RegisterPayload) => {
    const {data} = await api.post(
      "/auth/register",
      payload,
    )
    return data
  },

  logout: async () => {
    await api.post("/auth/logout")    
  }
}