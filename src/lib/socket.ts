import { useAuthStore } from '@/stores/auth.store'
import { io, Socket } from 'socket.io-client'

let sockets: Socket[] = []

export const createSocket = (namespace: string) => {
  const token = useAuthStore.getState().access_token

  const socket = io(
    `${process.env.NEXT_PUBLIC_WS_URL}${namespace}`,
    {
      transports: ['websocket'],
      auth: { token }
    }
  )

  sockets.push(socket)
  return socket
}

export const reconnectSockests = () => {
  const token = useAuthStore.getState().access_token

  sockets.forEach(socket => {
    socket.disconnect()
    socket.auth = { token }
    socket.connect()
  })
}

export const disconnectSockets = () => {
  sockets.forEach(s => s.disconnect())
  sockets = []
}

export const userSocket = () => createSocket('/ws/users')
export const listSocket = () => createSocket('/ws/lists')
export const itemSocket = () => createSocket('/ws/items')
export const listItemSocket = () => createSocket('/ws/items_lists')
export const sharedListSocket = () => createSocket('/ws/shared_list')
