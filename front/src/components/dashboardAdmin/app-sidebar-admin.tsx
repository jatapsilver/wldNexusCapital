"use client";

import * as React from "react";
import { Hexagon, Users, CreditCard, MailPlus, Wallet } from "lucide-react";

import { NavMain } from "@/components/dashboardAdmin/nav-main-admin";
import { NavUser } from "@/components/dashboardAdmin/nav-user-admin";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getUserBasicInformation } from "@/server/dashboard/sidebar/getUserBasicInformation";

export function AppSidebar({
  setActiveComponent,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  setActiveComponent: (title: string) => void;
}) {
  const [user, setUser] = React.useState({
    name: "Cargando...",
    email: "Cargando...",
    avatar: "",
  });

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserId = localStorage.getItem("sub");

      if (!storedUserId) {
        console.warn("No se encontró userId en localStorage.");
        return;
      }

      try {
        const userData = await getUserBasicInformation(storedUserId);
        if (userData) {
          setUser({
            name: userData[0] || "Sin nombre",
            email: userData[1] || "Sin email",
            avatar: "",
          });
        }
      } catch (error) {
        console.error("Error obteniendo información del usuario:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const navMain = [
    {
      title: "Inicio",
      url: "#",
      icon: Hexagon,
      isActive: true,
    },
    {
      title: "Usuarios",
      url: "#",
      icon: Users,
    },
    {
      title: "Historial",
      url: "#",
      icon: Users,
    },

    {
      title: "Pagos",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "Balance",
      url: "#",
      icon: Wallet,
    },

    {
      title: "Soporte",
      url: "#",
      icon: MailPlus,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="text-white bg-site">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent className="bg-site text-white ">
        <NavMain items={navMain} setActiveComponent={setActiveComponent} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
