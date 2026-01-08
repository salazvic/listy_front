'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ListService } from "@/services/list.service"
import { useAuthStore } from "@/stores/auth.store"
import { Trash2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Props = {
  item: any
  role?: string
}

export function ItemCard({item, role}: Props) {
  const user = useAuthStore(s => s.user)
  const [purchased, setPurchased] = useState(item.purchased)
  const [newQuantity, setNewQuantity] = useState(item.quantity)
  const [newPrice, setNewPrice] = useState(item.price)
  const isInitialRender = useRef(true)

  const paramsUrl = useParams()
  const id = paramsUrl.id as string
  const lastSentRef = useRef<string | null>(null)
  const userInteractedRef = useRef(false)

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    userInteractedRef.current = true
    setNewQuantity(Number(e.target.value))
  }

  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    userInteractedRef.current = true
    setNewPrice(Number(e.target.value))
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    userInteractedRef.current = true
    ListService.deleteItemList(id, item.id)
  }

  const handleTogglePurchased = (checked: boolean) => {
    userInteractedRef.current = true
    setPurchased(checked)
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    if(!user?.id) {
      return
    }

    if (!userInteractedRef.current) return

    const payload = {
      id: item.id,
      price: Number(newPrice),
      quantity: newQuantity,
      purchased,
      ...(purchased && user?.id && {purchasedById: user?.id})
    }

    const hash = JSON.stringify(payload)

    if (lastSentRef.current === hash) return

    const timeout = setTimeout(() => {
      lastSentRef.current = hash
      ListService.updateItemList(id, payload)
    }, 800)

    return () => clearTimeout(timeout)
  }, [newPrice, newQuantity, purchased, user])

  useEffect(() => {
    setPurchased(item.purchased)
    setNewQuantity(item.quantity)
    setNewPrice(item.price)
  }, [item.purchased, item.quantity, item.price])

  return (
    <Card className={purchased ? "opacity-50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="font-medium text-black">
          {item?.item?.name.toUpperCase()}
        </span>
        <Checkbox 
          disabled={role === 'viewer' && true}
          id={item?.id} 
          checked={purchased}
          className="rounded-full w-6 h-6"
          onCheckedChange={handleTogglePurchased}
        />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-32 bg-muted rounded flex items-center justify-center">
          {item?.item?.imageUrl ? (
            <img 
              src={item?.item?.imageUrl} 
              alt={item?.item?.name} 
              className="h-full object-contain"
            />
          ) : (
            <span className="text-5xl font-bold text-muted-foreground uppercase">
              {item?.item?.name.charAt(0) ?? "?"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Cantidad: 
          </label>
          <Input 
          
            type="number" 
            value={newQuantity} 
            onChange={handleQuantity}
            disabled={purchased || role === 'viewer' && true}     
          />
        </div>
        <div className="space-y-1">
            <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Precio: 
            </label>
            <Input 
              type="number" 
              value={newPrice} 
              onChange={handlePrice}
              disabled={purchased || role === 'viewer' && true}            
            />
        </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            disabled={purchased || role === 'viewer' && true}          
            onClick={handleDelete}
            className="text-red-400 hover:text-red-600! hover:bg-red-300"
          >
            <Trash2 size={20}/>
          </Button>
          <p className="text-sm font-semibold text-right text-foreground">
            subtotal: ${newQuantity * newPrice}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}