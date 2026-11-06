"use client"

import * as React from "react"
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { redirect, usePathname } from "next/navigation"
import parentSidebarMenuData from "@/constants/parent-sidebar-menu"
import studentSidebarMenuData from "@/constants/student-sidebar-menu"



function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  // Helper to accurately determine active state, including nested routes
  const isUrlActive = (url: string) => {
    if (!pathname || url === "#") return false
    if (url === "/") return pathname === "/" // Exact match for home to prevent it from always being active
    return pathname.startsWith(url) 
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          
          // Check if parent URL matches, or if any of its sub-items match
          const isItemActive = isUrlActive(item.url) || item.items?.some((sub) => isUrlActive(sub.url))

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                {/* Apply isActive to top-level link */}
                <SidebarMenuButton asChild tooltip={item.title} isActive={isItemActive}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {/* Apply isActive to collapsible trigger */}
                  <SidebarMenuButton tooltip={item.title} isActive={isItemActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = isUrlActive(subItem.url)
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          {/* Apply isActive to the sub-item link */}
                          <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ElementType
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

async function handleLogout() {
  const { data: session, isPending, error } = authClient.useSession();
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        switch (session?.user.role) {
          case "admin":
            redirect("/admin/login");
          case "parent":
            redirect("/parent/login");
          case "student":
            redirect("/student/login");
          case "mentor":
            redirect("/mentor/login");
        }
      },
    },
  });
}


function navMainItemsForRole(role: string) {
  switch (role) {
    case "parent":
      return parentSidebarMenuData.navMain;
    // case "parent":
    //   return data.navMainParent;
    case "student":
      return studentSidebarMenuData.navMain;
    // case "mentor":
    //   return data.navMainMentor;
  }
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending, error } = authClient.useSession();
  const user = {
    name: session?.user.name,
    email: session?.user.email,
    role: session?.user.role as string,
    avatar: "/avatars/shadcn.jpg",
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-2xl font-extrabold text-white">Champions.</span>
          <span className="truncate text-md font-light capitalize">{user.role} Portal</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain  items={navMainItemsForRole(user.role) as any || []} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
