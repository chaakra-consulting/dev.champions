import { BanknoteArrowDown, BookOpen, Bot, Box, BrainCircuit, Frame, GraduationCap, LayoutDashboardIcon, PieChart, Settings2, SquareTerminal } from "lucide-react";

const adminSidebarMenuData = {

  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Paket",
      url: "/admin/dashboard/paket",
      icon: Box,
    },
    {
      title: "Mentor",
      url: "/admin/mentor",
      icon: BrainCircuit,
    },
    {
      title: "Siswa",
      url: "/admin/dashboard/student",
      icon: GraduationCap,
    },
    {
      title: "Pembayaran",
      url: "#",
      icon: BanknoteArrowDown,
      isActive: false,
      items: [
        {
          title: "Riwayat Pembayaran",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
export default adminSidebarMenuData