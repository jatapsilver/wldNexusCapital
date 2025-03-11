"use client";

import * as React from "react";
import {
  Hexagon,
  Users,
  CreditCard,
  MailPlus,
  User,
  Wallet,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";

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

  const [profile, setProfile] = React.useState("");

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

    // Obtener el perfil desde localStorage
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      setProfile(storedProfile);
    }

    fetchUserInfo();
  }, []);

  const navMain = [
    { title: "Inicio", url: "#", icon: Hexagon, isActive: true },
    { title: "Perfil", url: "#", icon: User },
    { title: "Equipo", url: "#", icon: Users },
    // Solo se agrega "Membresia" si el perfil no es "ambassador"
    ...(profile !== "ambassador"
      ? [{ title: "Membresia", url: "#", icon: CreditCard }]
      : []),
    { title: "Transacciones", url: "#", icon: Wallet },
    { title: "Soporte", url: "#", icon: MailPlus },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="text-white bg-site">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent className="bg-site text-white">
        <NavMain items={navMain} setActiveComponent={setActiveComponent} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
