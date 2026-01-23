"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { site } from "@/lib/brand-config"
import type { UserRole } from "@/lib/auth"
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    FileText,
    Heart,
    HelpCircle,
    Home,
    MessageCircle,
    Settings2,
    Star,
    User,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
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

// Menu items for BUSINESS role (original menu - unchanged)
const navBusiness: NavItem[] = [
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
        title: "Mensagens",
        url: "/mensagens",
        icon: MessageCircle,
    },
    {
        title: "Conta",
        url: "/account",
        icon: User,
    },
    {
        title: "Fale Conosco",
        url: "/fale-conosco",
        icon: HelpCircle,
    },
]

// Menu items for USER role (reduced menu)
const navUser: NavItem[] = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Currículo",
        url: "/curriculo",
        icon: FileText,
    },
    {
        title: "Meus Reviews",
        url: "/meus-reviews",
        icon: Star,
    },
    {
        title: "Favoritos",
        url: "/favoritos",
        icon: Heart,
    },
    {
        title: "Conta",
        url: "/account",
        icon: User,
    },
    {
        title: "Fale Conosco",
        url: "/fale-conosco",
        icon: MessageCircle,
    },
]

// Admin menu (only for business role)
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    userRole?: UserRole
}

export function AppSidebar({ userRole = 'user', ...props }: AppSidebarProps) {
    const { state } = useSidebar()
    const pathname = usePathname()

    // Select menu based on role
    const navMain = userRole === 'business' ? navBusiness : navUser
    const showAdminSection = userRole === 'admin'

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

                {/* Admin Group - Only visible for business role */}
                {showAdminSection && (
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
                )}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
