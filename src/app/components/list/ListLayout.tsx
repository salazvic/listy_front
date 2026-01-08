'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function ListLayout({sidebar, children} : {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden text-foreground bg-[#90adc5] rounded-md">
    
      {/* DESKTOP */}
      <aside className="hidden md:block w-80 shrink-0 border-r border-border p-4 overflow-y-auto">
        {sidebar}
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* MOBILE HEADER*/}
        <div className="md:hidden flex items-center justify-between mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-80 p-4 bg-[#90adc5] text-black">
              <SheetHeader>              
                <SheetTitle>Menu de la lista</SheetTitle>
              </SheetHeader>
              {sidebar}
            </SheetContent>
          </Sheet>

          <span className="font-semibold truncate">
            Lista
          </span>
        </div>

        {children}
      </main>
    </div>
  )
}