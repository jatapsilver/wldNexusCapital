"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboardAdmin/app-sidebar-admin";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { StartAdmin } from "@/components/dashboardAdmin/StartAdmin";
import { UsersAdmin } from "@/components/dashboardAdmin/UsersAmin";
import { HistoryAdmin } from "@/components/dashboardAdmin/HistoryAdmin";
import { PayAdmin } from "@/components/dashboardAdmin/PayAdmin";
import { BalanceAdmin } from "@/components/dashboardAdmin/BalanceAdmin";
import { SupportAdmin } from "@/components/dashboardAdmin/SupportAdmin";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardAdmin() {
  const [activeComponent, setActiveComponent] = useState("Inicio");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Inicio":
        return <StartAdmin />;
      case "Usuarios":
        return <UsersAdmin />;
      case "Historial":
        return <HistoryAdmin />;
      case "Pagos":
        return <PayAdmin />;
      case "Balance":
        return <BalanceAdmin />;
      case "Soporte":
        return <SupportAdmin />;
      default:
        return <StartAdmin />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <SidebarProvider>
        <AppSidebar setActiveComponent={setActiveComponent} />
        <SidebarInset className="h-screen max-h-screen overflow-y-auto scrollbar-hidden">
          <header className="flex h-16 p-4 items-center gap-2 bg-site text-white mb-5">
            <div className="flex items-center gap-2 px-4 text-white">
              <SidebarTrigger className="ml-2 text-white" />
              <h2 className="text-2xl text-white">
                Bienvenido Admin {username || " "}
              </h2>
            </div>
          </header>
          {renderComponent()}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
