import { Home, Bot, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Chatbots", url: "/chatbots", icon: Bot },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Account Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));

  return (
    <Sidebar
      className={`${
        state === "collapsed" ? "w-16" : "w-64"
      } transition-all duration-300 border-r bg-nav-background/50 backdrop-blur-md border-nav-border shadow-elegant-sm`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={`${
            state === "collapsed" ? "sr-only" : ""
          } text-muted-foreground font-medium mb-2`}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`${
                      isActive(item.url)
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "hover:bg-secondary/80 text-foreground"
                    } transition-all duration-200 rounded-lg ${
                      state === "collapsed" ? "w-10 h-10 p-0 justify-center" : "px-3 py-2"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className={`h-5 w-5 ${
                        state === "collapsed" ? "" : "mr-2"
                      }`} />
                      {state !== "collapsed" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}