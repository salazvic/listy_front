'use client'

import { ListItemsGrid } from "@/app/components/list/ListItemsGrid"
import { ListLayout } from "@/app/components/list/ListLayout"
import { ListSidebar } from "@/app/components/list/ListSidebar"
import { useListItemSocket } from "@/hooks/useListItemSocket"
import { useListSocket } from "@/hooks/useListSocket"
import { useSharedSocket } from "@/hooks/useSharedSocket"
import { ListService } from "@/services/list.service"
import { useListStore } from "@/stores/lists.store"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useShallow } from 'zustand/shallow'

export default function ListDetailPage() {
  const paramsUrl = useParams()
  const router = useRouter()
  const id = paramsUrl.id as string

  useListSocket(id)
  useListItemSocket(id)
  useSharedSocket(id)  
  
  const list = useListStore(useShallow(s => s.listsById[id]))
  const upserList = useListStore(s => s.upsertList)
  const setActiveList = useListStore(s => s.setActiveList)

  useEffect(() => {
    if(!list) {
      router.push("/lists")
    }
  }, [list, router])

  useEffect(() => {
    if(!list || list?.isFull) return

    const getList = async () => {
      const data = await ListService.getListById(id)
      upserList(data)
    }

    getList()
  }, [id, list?.isFull, upserList])

  useEffect(() => {
    if(!list) return 

    setActiveList(id)
    return () => {
      setActiveList(null)
    }
  }, [id, list, setActiveList])

  if(!list) return null

  return (
    <ListLayout sidebar={<ListSidebar list={list}/> }>
      <ListItemsGrid items={list?.items ?? []} role={list?.role}/>
    </ListLayout>
  )
}