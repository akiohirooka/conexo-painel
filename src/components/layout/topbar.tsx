"use client"

import { Bell, Plus, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Topbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />

                <div className="relative hidden md:block w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button className="hidden md:flex bg-conexo-blue hover:bg-conexo-blue/90 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Anúncio
                </Button>
                <Button size="icon" className="md:hidden bg-conexo-blue hover:bg-conexo-blue/90 text-white" aria-label="Novo Anúncio">
                    <Plus className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notificações">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/avatars/01.png" alt="@usuario" />
                                <AvatarFallback>US</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Usuário</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    usuario@conexo.jp
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Configurações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 font-medium">
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
