import { useState } from "react";

export function UsersAdmin() {
  const [filter, setFilter] = useState<Filter>("all");

  const users = [
    {
      date: "2024-08-24",
      name: "Juan Pérez",
      username: "juanp",
      email: "juan@example.com",
      status: "Activo",
      lastPackage: 300,
      progress: 80,
      totalWithdrawn: 150,
    },
    {
      date: "2024-08-23",
      name: "María López",
      username: "marial",
      email: "maria@example.com",
      status: "Inactivo",
      lastPackage: 500,
      progress: 100,
      totalWithdrawn: 500,
    },
    {
      date: "2024-08-22",
      name: "Carlos Ruiz",
      username: "carlosr",
      email: "carlos@example.com",
      status: "Activo",
      lastPackage: 1000,
      progress: 90,
      totalWithdrawn: 300,
    },
    {
      date: "2024-08-20",
      name: "Ana Torres",
      username: "anatorres",
      email: "ana@example.com",
      status: "Activo",
      lastPackage: 700,
      progress: 50,
      totalWithdrawn: 100,
    },
    {
      date: "2025-2-06",
      name: "Ana jimenez",
      username: "anatorres",
      email: "ana@example.com",
      status: "Activo",
      lastPackage: 700,
      progress: 50,
      totalWithdrawn: 100,
    },
    {
      date: "2025-1-31",
      name: "Ana Perez",
      username: "anatorres",
      email: "ana@example.com",
      status: "Activo",
      lastPackage: 700,
      progress: 50,
      totalWithdrawn: 100,
    },
  ];

  interface User {
    date: string;
    name: string;
    username: string;
    email: string;
    status: string;
    lastPackage: number;
    progress: number;
    totalWithdrawn: number;
  }

  type Filter = "24h" | "7d" | "30d" | "all";

  const filterUsers = (filter: Filter): User[] => {
    const now = new Date();
    return users.filter((user) => {
      const userDate = new Date(user.date);
      const diffTime =
        (now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24);
      if (filter === "24h") return diffTime <= 1;
      if (filter === "7d") return diffTime <= 7;
      if (filter === "30d") return diffTime <= 30;
      return true;
    });
  };

  const filteredUsers = filterUsers(filter);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-black">
        Usuarios Administrador
      </h2>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 text-black">
        {[
          { label: "Últimas 24h", value: "24h" },
          { label: "Últimos 7 días", value: "7d" },
          { label: "Últimos 30 días", value: "30d" },
          { label: "Todos", value: "all" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value as Filter)}
            className={`px-4 py-2 rounded-lg text-black ${
              filter === value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto text-black">
        <table className="w-full border-collapse border border-gray-200 shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Correo</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-right">Último Paquete ($)</th>
              <th className="p-2 text-right">Progreso (%)</th>
              <th className="p-2 text-right">Total Retirado ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">{user.date}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td
                  className={`p-2 text-center font-bold ${
                    user.status === "Activo" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {user.status}
                </td>
                <td className="p-2 text-right">
                  {user.lastPackage.toFixed(2)}
                </td>
                <td className="p-2 text-right">{user.progress}%</td>
                <td className="p-2 text-right">
                  {user.totalWithdrawn.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
