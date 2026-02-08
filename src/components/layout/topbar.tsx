"use client"

import { useRouter } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useClerk, useUser } from "@clerk/nextjs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TopbarProps {
    fallbackName?: string
    fallbackEmail?: string
    fallbackImageUrl?: string
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U"
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

export function Topbar({ fallbackName, fallbackEmail, fallbackImageUrl }: TopbarProps) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const displayName = user?.fullName || fallbackName || "Usuário"
    const displayEmail = user?.primaryEmailAddress?.emailAddress || fallbackEmail || ""
    const avatarSrc = user?.imageUrl || fallbackImageUrl

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


                <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notificações">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                                {avatarSrc ? <AvatarImage src={avatarSrc} alt={displayName} /> : null}
                                <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                                    {getInitials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{displayName}</p>
                                <p className="text-xs leading-none text-black">
                                    {displayEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/account')}>
                            Configurações do Perfil
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 font-medium cursor-pointer"
                            onClick={async () => {
                                await signOut();
                                // Force redirect
                                window.location.href = "/sign-in";
                            }}
                        >
                            Sair (Logout)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
