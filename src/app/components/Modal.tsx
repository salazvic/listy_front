'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  imageUrl?: string
}

type Item = {
  id?: string
  name: string
  imageUrl?: string
}

type UserRole = 'editor' | 'viewer'

type SubmitPayload =
  | { type: 'simple'; value: string }
  | { type: 'user'; user: User; role: UserRole }
  | {
      type: 'item'
      item: Item
      quantity: string
      price: string
      isNew: boolean
    }

type ModalMode = 'simple' | 'user' | 'item'

interface ModalProps {
  isOpen: boolean
  title: string
  placeholder?: string
  mode: ModalMode
  users?: User[]
  items?: Item[]
  onClose: () => void
  onSubmit: (payload: SubmitPayload) => void
  onSearch?: (term: string) => void
}

export default function Modal({
  isOpen,
  title,
  placeholder = 'Escribí algo...',
  mode,
  users = [],
  items = [],
  onClose,
  onSubmit,
  onSearch
}: ModalProps) {
  const [value, setValue] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [selected, setSelected] = useState<User | Item | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  
  useEffect(() => {
    if (!isOpen) {
      setValue('')
      setQuantity('')
      setPrice('')
      setSelected(null)
      setRole(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (mode !== 'item') return
    if (!value.trim()) return

    const found = items.find(
      i => i.name.toLowerCase() === value.toLowerCase()
    )

    if (found) {
      setSelected(found)
    }
  }, [items])


  if (!isOpen) return null

  const filtered = mode === 'user'
    ? users.filter(u =>
        u.name.toLowerCase().includes(value.toLowerCase()) ||
        u.email.toLowerCase().includes(value.toLowerCase()) 
      )
    : items.filter(i =>
        i.name.toLowerCase().includes(value.toLowerCase())
      )

  const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const isUserMode = mode === 'user'
  const noResults = isUserMode && value.trim() !== '' && filtered.length === 0
  const canInvite = noResults && isValidEmail(value)

  const onlyNumbers = (value: string) => value.replace(/[^0-9.]/g, '')


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-5">
        <h2 className="text-lg font-semibold text-black pb-0 mb-0">{title}</h2>

        {mode === 'user' && (
          <div className="pb-2 text-sm text-gray-500 mb-2">
            Si no encuentra el usuario escribe su correo e invitalo
          </div>
        )}

        {/* INPUT PRINCIPAL */}
        <input
          className="w-full border rounded-md px-3 py-2 mb-3 text-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onSearch?.(e.target.value)
          }}
        />

        {/* USER / ITEM SELECT */}
        {(mode === 'user' || mode === 'item') && value.trim() !== '' && (
          <div className="max-h-48 overflow-y-auto border rounded-md mb-3">
            {filtered.length > 0 ? (
              filtered.map((el) => {
                const isSelected = selected?.id === el.id

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelected(el)}
                    className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer
                      ${isSelected ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                  >
                    {el.imageUrl ? (
                      <img
                        src={el.imageUrl}
                        alt={el.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        {el.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-800">{el.name}</span>
                  </div>
                )
              })
            ) : (
              mode === 'item' && (
                <button
                  onClick={() =>
                    onSubmit({
                      type: 'item',
                      item: { name: value },
                      quantity,
                      price,
                      isNew: true
                    })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  ➕ Crear “{value}”
                </button>
              )
            )}
          </div>
        )}


        {/* CAMPOS EXTRA SOLO PARA ITEM */}
        {mode === 'item' && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Detalles del producto
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="border text-gray-500 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ej: 2"
                  value={quantity}
                  onKeyDown={blockInvalidKeys}
                  onChange={(e) => setQuantity(onlyNumbers(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    className="w-full text-gray-500 border rounded-md pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0.00"
                    value={price}
                    onKeyDown={blockInvalidKeys}
                    onChange={(e) => setPrice(onlyNumbers(e.target.value))}
                  />

                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'user' && canInvite && (
          <button
            onClick={() =>
              onSubmit({
                type: 'simple',
                value // email
              })
            }
            className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold cursor-pointer"
          >
            📧 Enviar invitación a “{value}”
          </button>
        )}

        {/* CAMPOS EXTRA SOLO PARA USER */}
        {mode === 'user' && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2 text-center">
              Seleccione el rol del usuario
            </p>

            <div className='flex justify-center gap-6'>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={role === 'editor'}
                  onChange={() => setRole('editor')}
                />
                <span>Editor</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={() => setRole('viewer')}
                />
                <span>Observador</span>
              </label>
            </div>
          </div>
        )}

        {/* BOTONES CANCELAR Y GUARDAR*/}
        <div className="flex gap-2">          

          {/* SIMPLE (crear lista, etc) */}
          {mode === 'simple' ? (
              <button
                disabled={!value.trim()}
                onClick={() =>
                  onSubmit({
                    type: 'simple',
                    value
                  })
                }
                className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
              >
                Confirmar
              </button>
            ) : (
              <button
                disabled={!selected || (mode === 'user' && !role)}
                onClick={() => {
                  if(!selected) return

                  if (mode === 'user') {
                    if(!role) return
                    onSubmit({ type: 'user', user: selected as User, role})
                  }

                  if (mode === 'item') {
                    onSubmit({
                      type: 'item',
                      item: selected as Item,
                      quantity,
                      price,
                      isNew: false
                    })
                  }
                }}
                className={`w-full py-2 rounded-md font-semibold transition 
                  ${selected
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Guardar
              </button>
            )
          }

          <button
            onClick={onClose}
            className="w-full font-bold text-white bg-red-500 py-2 hover:bg-red-600 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
