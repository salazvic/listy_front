import api from "../lib/api"

export const UserService = {
  allUsers: async () => {
    const { data } = await api.get('/users')
    return data
  },

  invite: async(email: any) => {
    const { data } = await api.post('/auth/invite', {email})
    return data
  }
}