import api from "./api";


export const SharedService = {
  getSharedList: async () => {
    const { data } = await api.get(
      `/shared_lists`
    )
    return data
  },

  addUserList: async (idList: string, user: any) => {
    try {
      const { data } = await api.post(
        `/shared_lists/${idList}`,
        {
          userId: user.id,
          role: user.role
        }
      )
      return data
    } catch (err: any) {
      console.log(err.response.data.message)
    }
  },

  deleteUSerList: async(idList: string, sharedId: string) => {
    try {
      const { data } = await api.delete(
        `/shared_lists/${idList}/${sharedId}`
      )
      return data
    } catch (err: any) {
      console.log(err.response.data.message)      
    }
  },

  changeRoleUser: async(idList: string, idShared: string, role: 'editor' | 'viewer') => {
    try {
      const { data } = await api.patch(
        `/shared_lists/${idList}`,
        {
          id: idShared,
          role
        }
      )
      return data
    } catch (err: any) {
      console.log(err.response.data.message)      
    }
  }
}