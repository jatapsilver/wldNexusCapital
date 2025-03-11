"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { StartDashboard } from "@/components/dashboard/StartDashboard";
import { ProfileDashboard } from "@/components/dashboard/ProfileDashboard";
import { TeamDashboard } from "@/components/dashboard/TeamDashboard";
import { RangesDashboard } from "@/components/dashboard/RangesDashboard";
import { TransactionsDashboard } from "@/components/dashboard/TransactionsDashboard";
import { SupportDashboard } from "@/components/dashboard/SupportDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Inicio");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfile = localStorage.getItem("profile");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Inicio":
        return <StartDashboard />;
      case "Perfil":
        return <ProfileDashboard />;
      case "Equipo":
        return <TeamDashboard />;
      case "Membresia":
        return <RangesDashboard />;
      case "Transacciones":
        return <TransactionsDashboard />;
      case "Soporte":
        return <SupportDashboard />;
      default:
        return <StartDashboard />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "ambassador"]}>
      <SidebarProvider>
        <AppSidebar setActiveComponent={setActiveComponent} />
        <SidebarInset className="h-screen max-h-screen overflow-y-auto scrollbar-hidden">
          <header className="flex h-16 p-4 items-center gap-2 bg-site text-white mb-5">
            <div className="flex items-center gap-2 px-4 text-white">
              <SidebarTrigger className="ml-2 text-white" />
              <h2 className="text-2xl text-white">
                {profile === "ambassador" ? (
                  <>
                    Bienvenido{" "}
                    <span className="text-red-600">Embajador {username}</span>
                  </>
                ) : (
                  <>
                    Bienvenido{" "}
                    <span className="text-blue-400">
                      {username || "Usuario"}
                    </span>
                  </>
                )}
              </h2>
            </div>
          </header>
          {renderComponent()}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
