export type ListItem = {
  id: string
  name: string
  quantity?: number
  price?: number
  item: Item
  purchased?: boolean
  purchasedById?: string  
}

export type Item = {
  id: string
  name: string
  quantity?: number
  price?: number
}


export type Shared = {
  id: string,
  name: string,
  role: string, 
}

export type List = {
  id: string
  name: string
  role?: string
  items?: ListItem[]
  shared?: Shared[]
  isFull: boolean
}

export type UserShared = {
  id: string
  role: string
}
