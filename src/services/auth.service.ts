import api from "./api";

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
    console.log("respuesta me:", data)
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
      console.log(err)
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
  }
}