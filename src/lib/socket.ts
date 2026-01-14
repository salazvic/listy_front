import { useAuthStore } from '@/stores/auth.store'
import { io, Socket } from 'socket.io-client'

let sockets = new Map<string, Socket>()

export const getSocket = (namespace: string) => {
  if (sockets.has(namespace)) {
    return sockets.get(namespace)
  } 

  const socket = io(
    `${process.env.NEXT_PUBLIC_WS_URL}${namespace}`,
    {
      transports: ['websocket'],
      autoConnect: false
    }
  )

  sockets.set(namespace, socket)
  return socket
}

export const connectSockets = () => {
  const token = useAuthStore.getState().access_token
  if(!token) return

  sockets.forEach(socket => {
    socket.auth = { token }
    if (!socket.connected) socket.connect()
  })
}

export const disconnectSockets = () => {
  sockets.forEach(s => s.disconnect())
}

export const userSocket = () => getSocket('/ws/users')
export const listSocket = () => getSocket('/ws/lists')
export const itemSocket = () => getSocket('/ws/items')
export const listItemSocket = () => getSocket('/ws/items_lists')
export const sharedListSocket = () => getSocket('/ws/shared_list')
