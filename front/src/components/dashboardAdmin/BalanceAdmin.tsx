import React from "react";

export function BalanceAdmin() {
  const fondosRecibidos = [
    {
      fecha: "2025-02-06",
      username: "juanperez",
      valor: 150,
      paquete: "Gold",
      hashTransaccion: "abc123",
      wallet: "wallet_juan",
      dispersion: "completado",
    },
    {
      fecha: "2025-02-07",
      username: "anagomez",
      valor: 200,
      paquete: "Platinum",
      hashTransaccion: "def456",
      wallet: "wallet_ana",
      dispersion: "pendiente",
    },
  ];

  const dispersionFondos = [
    {
      fecha: "2025-02-06",
      valorTotal: 500,
      walletNiyi: "wallet_niyi_123",
      cantidad: 250,
      hashNiyi: "hash_niyi_abc",
      walletAndres: "wallet_andres_456",
      cantidadandres: 250,
      hashAndres: "hash_andres_def",
    },
  ];

  return (
    <div className="text-black p-4">
      {/* Historial de Fondos Recibidos */}
      <h2 className="text-xl font-bold mb-4">Historial de Fondos Recibidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Valor</th>
              <th className="border p-2">Paquete</th>
              <th className="border p-2">Hash Transacción</th>
              <th className="border p-2">Wallet</th>
              <th className="border p-2">Dispersión</th>
            </tr>
          </thead>
          <tbody>
            {fondosRecibidos.map((item, index) => (
              <tr key={index} className="text-center border">
                <td className="border p-2">{item.fecha}</td>
                <td className="border p-2">{item.username}</td>
                <td className="border p-2 text-green-600 font-bold">
                  ${item.valor}
                </td>
                <td className="border p-2">{item.paquete}</td>
                <td className="border p-2">{item.hashTransaccion}</td>
                <td className="border p-2">{item.wallet}</td>
                <td className="border p-2">{item.dispersion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Historial de Dispersión de Fondos */}
      <h2 className="text-xl font-bold my-4">
        Historial de Dispersión de Fondos
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 min-w-[700px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Valor Total</th>
              <th className="border p-2">Wallet Niyi</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Hash Niyi</th>
              <th className="border p-2">Wallet Andrés</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Hash Andrés</th>
            </tr>
          </thead>
          <tbody>
            {dispersionFondos.map((item, index) => (
              <tr key={index} className="text-center border">
                <td className="border p-2">{item.fecha}</td>
                <td className="border p-2 font-bold text-blue-600">
                  ${item.valorTotal}
                </td>
                <td className="border p-2">{item.walletNiyi}</td>
                <td className="border p-2 text-red-500 font-bold">
                  ${item.cantidad}
                </td>
                <td className="border p-2">{item.hashNiyi}</td>
                <td className="border p-2">{item.walletAndres}</td>
                <td className="border p-2 text-red-500 font-bold">
                  ${item.cantidadandres}
                </td>
                <td className="border p-2">{item.hashAndres}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
