import { io, Socket } from 'socket.io-client'

let userSocket: Socket | null = null
let listSocket: Socket | null = null
let itemSocket: Socket | null = null
let listItemSocket: Socket | null = null
let sharedListSocket: Socket | null = null

export const getUserSocket = () => {
  if (typeof window === 'undefined') return null
  if(!userSocket) {
    userSocket = io(process.env.NEXT_PUBLIC_WS_URL!+'/ws/users', {
      transports: ['websocket'],
      withCredentials: true
    })
  }  
 return userSocket
} 

export const getListSocket = () => {
  if (typeof window === 'undefined') return null

  if(!listSocket) {
    listSocket = io(process.env.NEXT_PUBLIC_WS_URL!+'/ws/lists', 
    {
      transports: ['websocket'],
      withCredentials: true
    })
  }
  
 return listSocket
} 

export const getItemSocket = () => {
  if (typeof window === 'undefined') return null

  if(!itemSocket) {
    itemSocket = io(process.env.NEXT_PUBLIC_WS_URL!+'/ws/items', 
    {
      transports: ['websocket'],
      withCredentials: true
    })
  }
  
 return itemSocket
}

export const getListItemSocket = () => {
  if (typeof window === 'undefined') return null
  
  if(!listItemSocket) {
    listItemSocket = io(process.env.NEXT_PUBLIC_WS_URL!+'/ws/items_lists', 
    {
      transports: ['websocket'],
      withCredentials: true
    })
  }
  
 return listItemSocket
}

export const getSharedListSocket = () => {
  if (typeof window === 'undefined') return null

  if (!sharedListSocket) {
    sharedListSocket = io(`${process.env.NEXT_PUBLIC_WS_URL}/ws/shared_list`, {
      transports: ['websocket'],
      withCredentials: true,
    })
  }
 return sharedListSocket
}