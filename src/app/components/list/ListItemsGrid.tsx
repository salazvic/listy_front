'use client'

import { ItemCard } from "./ItemCard"

type Props = {
  items: any[]
  role?: string
}

export function ListItemsGrid({items, role}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} role={role}/>
      ))}
    </div>
  )
}