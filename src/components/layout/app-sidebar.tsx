"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { site } from "@/lib/brand-config"
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    Frame,
    Heart,
    Home,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    User,
    Users,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
    title: string;
    url: string;
    icon?: any;
    items?: {
        title: string;
        url: string;
        icon?: any;
    }[];
}

// Menu items.
const navMain: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Negócios",
        url: "/listings/business",
        icon: Building2,
    },
    {
        title: "Eventos",
        url: "/listings/events",
        icon: Calendar,
    },
    {
        title: "Empregos",
        url: "/listings/jobs",
        icon: Briefcase,
    },

    {
        title: "Conta",
        url: "/account",
        icon: User,
    },
]

const navAdmin: NavItem[] = [
    {
        title: "Admin",
        url: "#",
        icon: Settings2,
        items: [
            {
                title: "Moderação",
                url: "/admin/moderation",
            },
            {
                title: "Conteúdos",
                url: "/admin/content",
            },
            {
                title: "Usuários",
                url: "/admin/users",
            },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar()
    const pathname = usePathname()

    // Helper to check if a main item or its children are active
    const isItemActive = (item: NavItem) => {
        if (item.url !== "#" && pathname.startsWith(item.url)) return true
        if (item.items?.some(subItem => pathname.startsWith(subItem.url))) return true
        return false
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex w-full items-center justify-start">
                                    {state === "collapsed" && site.logo.collapsed ? (
                                        <img src={site.logo.collapsed} alt="Conexo" className="h-8 w-auto object-contain mx-auto" />
                                    ) : (
                                        <img src="/logo-conexo.png" alt="Conexo Logo" className="h-8 w-auto object-contain" />
                                    )}
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
                    <SidebarMenu>
                        {navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.items ? (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isItemActive(item)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} isActive={isItemActive(item)}>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Admin Group - Hidden for now or visible */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Administração</SidebarGroupLabel>
                    <SidebarMenu>
                        {navAdmin.map((item) => (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isItemActive(item)}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} isActive={isItemActive(item)}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                        <a href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
