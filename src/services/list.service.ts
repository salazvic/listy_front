import api from "./api";

export const ListService = {
  getLists: async () => {
    const { data } = await api.get(
      '/lists'
    )
    return data
  },

  getListById: async (idList: string) => {
    const { data } = await api.get(
      `/lists/${idList}`
    )
    const normalizeItem = (item: any) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })

    const newData = {
      ...data,
      items: data?.items?.map(normalizeItem) ?? []
    }

    return newData
  },

  createList: async(nameList: string) => {
    const { data } = await api.post(
      '/lists', 
      {name: nameList}
    )
  },

  deleteList: async(id: string) => {
    const data = await api.delete(
      `/lists/${id}`      
    )
    return data
  },

  addItemList: async(idList: string, item: any) => {
    try {
      const data = await api.post(
        `/items_lists/${idList}`,
        {
          itemId: item.id,
          quantity: item.quantity ? Number(item.quantity) : 1,
          price: item.price ? Number(item.price) : 0
        }
      )
      return data
    } catch (error: any) {
      console.log(error.response.data)
    }
  },

  updateList: async(idList: string, name: string) => {
    const { data } = await api.patch(
      `/lists/${idList}`,
      {name}
    )

    return data
  },

  updateItemList: async(idList: string, dataUpdate: any) => {
    try {
      const { data } = await api.patch(
        `/items_lists/${idList}`,
        dataUpdate
      )
      return data
    } catch (error: any) {
      console.log(error.response.data.message)
    }
  },

  deleteItemList: async(idList: string, idItem: string) => {
    try {
      const { data } = await api.delete(
        `/items_lists/${idList}/${idItem}`
      )
      return data
    } catch (err: any) {
      console.log(err?.response?.data.message)
    }
  },

  markAllPurchased: async(idList: string, payload: any) => {
    try {
     // console.log(`idList: ${idList} //purchased: ${payload.purchased} // data:`, payload.itemIds)
      const { data } = await api.patch(
        `/items_lists/${idList}/mark_all`,
        payload
      )
      return data
    } catch (err: any) {
      console.log(err?.response?.data.message)      
    }
  }
}