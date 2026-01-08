import api from "./api";

export const ItemService = {
  getItems: async () => {
    const {data} = await api.get(
      '/items'
    ) 
    return data
  },

  createItem: async (name: string) => {
    try {
      const { data } = await api.post(
        '/items',
        {name}
      )
      return data
    } catch (error: any) {
      console.log(error.response)
    }
  }
}