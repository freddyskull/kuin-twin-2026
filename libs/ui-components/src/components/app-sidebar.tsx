import * as React from "react"
import {
  AudioWaveform,
  Command,
  LogOut,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"


// This is sample data.
const data = {
  user: {
    name: "Alexandre V.",
    email: "alexandre@kuintwin.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "My Services",
      url: "#",
      icon: PieChart,
    },
    {
      title: "Orders",
      url: "#",
      icon: AudioWaveform,
    },
    {
      title: "Analytics",
      url: "#",
      icon: Command,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
  Servicios: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-lg">K</span>
          </div>
          <span className="font-bold text-white tracking-widest text-sm">KUIN TWIN</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.Servicios} />
      </SidebarContent>
      <SidebarFooter className="p-6">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors w-full p-2 rounded-lg hover:bg-red-500/10 mb-4 group">
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
