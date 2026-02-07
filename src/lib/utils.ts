import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeListFromApi(list: any){
  return {
    id: list.id,
    name: list.name,
    ownerId: list.ownerId,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,

    items: [],
    shared: [],
    role: 'OWNER',
    isFull: false,
  }
}
