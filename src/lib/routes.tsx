import { LayoutDashboard, ListStart } from 'lucide-react'

export const routes = [
  {
    name: "Mis Listas",
    link: "/lists",
    icon: <LayoutDashboard size={18} />
  },
  {
    name: "Otras Listas",
    link: "/shared_lists",
    icon: <ListStart size={18} />
  }
]