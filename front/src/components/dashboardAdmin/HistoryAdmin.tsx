import React, { useState } from "react";

export function HistoryAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  interface User {
    name: string;
    username: string;
    email: string;
    directos: number;
    paquetes: { nombre: string; cantidad: number; precio: number }[];
    retiros: { fecha: string; cantidad: number }[];
  }

  const [userHistory, setUserHistory] = useState<User | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const users = [
    {
      name: "Juan Pérez",
      username: "juanperez",
      email: "juan@ejemplo.com",
      directos: 5,
      paquetes: [
        { nombre: "Paquete 1", cantidad: 1, precio: 100 },
        { nombre: "Paquete 2", cantidad: 1, precio: 300 },
      ],
      retiros: [
        { fecha: "2025-01-10", cantidad: 100 },
        { fecha: "2025-01-15", cantidad: 200 },
      ],
    },
    {
      name: "Ana Gómez",
      username: "anagomez",
      email: "ana@ejemplo.com",
      directos: 3,
      paquetes: [
        { nombre: "Paquete 3", cantidad: 1, precio: 500 },
        { nombre: "Paquete 4", cantidad: 1, precio: 1000 },
      ],
      retiros: [
        { fecha: "2025-02-01", cantidad: 150 },
        { fecha: "2025-02-05", cantidad: 120 },
      ],
    },
  ];

  const handleSearch = () => {
    const user = users.find(
      (user) => user.username.toLowerCase() === searchTerm.toLowerCase()
    );
    setUserHistory(user || null);
  };

  const totalPaquetes = userHistory
    ? userHistory.paquetes.reduce(
        (total, paquete) => total + paquete.cantidad * paquete.precio,
        0
      )
    : 0;

  const totalRetiros = userHistory
    ? userHistory.retiros.reduce((total, retiro) => total + retiro.cantidad, 0)
    : 0;

  return (
    <div className="text-black p-4">
      <p className="text-black">usar juanperez o anagomez</p>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-2 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Buscar
        </button>
      </div>

      {userHistory && (
        <div>
          <h2 className="font-bold text-xl mb-2">Historial de Usuario</h2>
          <div className="mb-4 p-4 border rounded bg-gray-100">
            <p className="text-black">
              <strong>Nombre:</strong> {userHistory.name}
            </p>
            <p className="text-black">
              <strong>Username:</strong> {userHistory.username}
            </p>
            <p className="text-black">
              <strong>Correo:</strong> {userHistory.email}
            </p>
            <p className="text-black">
              <strong>Cantidad de Directos:</strong> {userHistory.directos}
            </p>
          </div>

          <h3 className="font-bold text-lg mb-2">Paquetes Adquiridos</h3>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {userHistory.paquetes.map((paquete, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{paquete.nombre}</td>
                  <td className="border p-2">{paquete.cantidad}</td>
                  <td className="border p-2">${paquete.precio}</td>
                  <td className="border p-2">
                    ${paquete.cantidad * paquete.precio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-bold text-black">
            Total en Paquetes: ${totalPaquetes}
          </p>

          <h3 className="font-bold text-lg mt-4 mb-2">Historial de Retiros</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {userHistory.retiros.map((retiro, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{retiro.fecha}</td>
                  <td className="border p-2">${retiro.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-bold mt-2 text-black">
            Total de Retiros: ${totalRetiros}
          </p>
        </div>
      )}

      {!userHistory && searchTerm && (
        <div className="mt-4 text-black">
          <p className="text-black">
            No se han encontrado datos para el usuario buscado.
          </p>
        </div>
      )}
    </div>
  );
}
