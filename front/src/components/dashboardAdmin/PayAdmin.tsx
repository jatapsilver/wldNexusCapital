export function PayAdmin() {
  // Simulación de pagos realizados cada lunes
  const payments = [
    { date: "2024-02-05", amount: 500 },
    { date: "2024-01-29", amount: 450 },
    { date: "2024-01-22", amount: 600 },
  ];

  // Último pago realizado (último lunes)
  const lastPayment = payments[0];

  // Lista de retiros solicitados
  const withdrawalRequests = [
    {
      name: "Juan Pérez",
      username: "juanp",
      email: "juanp@example.com",
      amount: 200,
    },
    {
      name: "María Gómez",
      username: "mariag",
      email: "mariag@example.com",
      amount: 150,
    },
    {
      name: "Carlos López",
      username: "carlosl",
      email: "carlosl@example.com",
      amount: 300,
    },
  ];

  // Suma total de retiros solicitados
  const totalWithdrawals = withdrawalRequests.reduce(
    (sum, request) => sum + request.amount,
    0
  );

  return (
    <div className="p-4 text-black">
      {/* Información del último pago */}
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold">Último Pago Realizado</h2>
        <p>Fecha: {lastPayment.date}</p>
        <p>Valor Pagado: ${lastPayment.amount.toFixed(2)}</p>
      </div>

      {/* Lista de retiros solicitados */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2">Retiros Solicitados</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Usuario</th>
                <th className="p-2 border">Correo</th>
                <th className="p-2 border">Monto ($)</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.map((request, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-2 border">{request.name}</td>
                  <td className="p-2 border">{request.username}</td>
                  <td className="p-2 border">{request.email}</td>
                  <td className="p-2 border text-right text-red-500">
                    {request.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total de retiros */}
        <div className="mt-4 text-right font-bold">
          Total de Retiros Solicitados: ${totalWithdrawals.toFixed(2)}
        </div>

        {/* Botón para realizar pagos */}
        <div className="mt-4 flex justify-center">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
            Realizar Pagos
          </button>
        </div>
      </div>
    </div>
  );
}
