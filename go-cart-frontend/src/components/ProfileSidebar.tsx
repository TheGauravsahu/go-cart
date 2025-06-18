import { Home, MapPin, Package, ShoppingCart, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import GradiantText from "./GradiantText";
import { Link } from "react-router-dom";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Cart",
    url: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "My Account",
    url: "/profile",
    icon: User,
  },
  {
    title: "My Orders",
    url: "/profile/orders",
    icon: Package,
  },
  {
    title: "Addresses",
    url: "/profile/addresses",
    icon: MapPin,
  },
];

function ProfileSidebar() {
  return (
    <Sidebar className="z-10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-2">
            <GradiantText text="GoCart" size="xl" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="md:py-8 py-4 md:px-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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

export default ProfileSidebar;
