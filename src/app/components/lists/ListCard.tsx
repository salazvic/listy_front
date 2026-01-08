import { useItemStore } from "@/stores/item.store"
import { ChevronRight, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Modal from "../Modal"
import { ListService } from "@/services/list.service"
import { ItemService } from "@/services/item.service"
import { ListItem } from "@/types/types"

type Props = {
  list: {
    id: string
    name: string
    items?: ListItem[]
    role?: string
  };
  onSubmit: () => void;
}

export function ListCard({ list, onSubmit }: Props) {
  const items = useItemStore(s => s.items)
  const [openModal, setOpenModal] = useState(false)
  const [newItem, setNewITem] = useState("")

  const router = useRouter()
  const itemsPreview = list?.items?.slice(0, 5)

  const addItem = async (value: any) => {
    
    if(value.isNew) {
      await ItemService.createItem(newItem)
      return
    }

    const addNewItem = {
      id: value.item.id,
      name: value.item.name,
      quantity: value.quantity,
      price: value.price 
    }

    await ListService.addItemList(list.id, addNewItem)
    //setOpenModal(false)
  }

  const searchItem = (term: any) => {
    setNewITem(term)
  }

  return (
    <>
      <Modal 
        isOpen={openModal}
        title="Agregar item"
        mode="item"
        placeholder="Ej: Leche"

        items={items?.map(i => ({id: i.id, name: i.name, imageUrl: i?.imageUrl}))}
        onSearch={(term) => searchItem(term)}
        onSubmit={(value) => addItem((value as any))}
        
        onClose={() => setOpenModal(false)}
      />
      <div
        className="
          p-5 rounded-2xl
          bg-white
          shadow-md
          hover:shadow-gray-400
          hover:shadow-lg
          transition
          flex flex-col
          gap-4
        "
      >

        {/* HEADER */}
        <div className=" flex items-start justify-between gap-3">
          {/* TEXTO */}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#1D3557] truncate">
              {list.name}
            </h2>
            <span className="text-gray-400 text-sm block">
              su rol es: {list.role === 'viewer' ? 'observador' : 'editor'}
            </span>
          </div>

          {/* BOTONES */}
          <div className="flex shrink-0 gap-1">
            <button
              disabled={list.role === 'viewer' && true}
              title="Agregar item"
              className="
                p-2 rounded-lg
                text-[#457B9D]
                hover:bg-[#A8DADC]/40
                transition
                cursor-pointer
              "
              onClick={() => {setOpenModal(() => !openModal)}}
            >
              <Plus size={18} />
            </button>

            <button
              title="Eliminar lista"
              disabled={list.role !== 'OWNER' && true}
              className={`
                p-2 rounded-lg
                text-[#f85959]
                hover:bg-[#da3b42]/40
                transition
                cursor-pointer
                ${list.role !== 'OWNER' && 'hidden'}
              `}
              onClick={() => {
                onSubmit()
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* ITEMS */}
        <div className="flex flex-col gap-2">
          {itemsPreview?.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Sin items aún
            </p>
          ) : (
          itemsPreview?.map(item => (
            <div 
              key={item?.id}
              className="text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              • {item.item.name}
            </div>
          )) 
          )}
        </div>

        {/* FOOTER */}
        <button
          onClick={() => router.push(`/lists/${list.id}`)}
          className="
            mt-auto
            flex items-center justify-between
            text-sm font-medium
            text-[#457B9D]
            hover:text-[#1D3557]
            transition
            cursor-pointer
          "
        >
          Ver más
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  )
}
