export function StartAdmin() {
  // Datos simulados
  const totalUsers = 1200;
  const activeUsers = 850;
  const totalPackagesValue = 50000; // Valor total de paquetes activos
  const lastActivatedUser = "Juan Pérez";
  const lastPackageValue = 300;
  const walletBalance = 98300; // Valor disponible en wallet de pagos
  const dailyPayment = totalPackagesValue * 0.01; // 1% del valor total de paquetes
  const availableDays = Math.floor(walletBalance / dailyPayment); // Días disponibles para pago

  const stats = [
    { title: "Usuarios Registrados", value: totalUsers },
    { title: "Usuarios Activos", value: activeUsers },
    {
      title: "Valor Total de Paquetes",
      value: `$${totalPackagesValue.toFixed(2)}`,
    },
    { title: "Último Usuario Activado", value: lastActivatedUser },
    { title: "Valor Último Paquete", value: `$${lastPackageValue.toFixed(2)}` },
    { title: "Wallet Disponible", value: `$${walletBalance.toFixed(2)}` },
    { title: "Pago Diario", value: `$${dailyPayment.toFixed(2)}` },
    { title: "Días Disponibles para Pago", value: availableDays },
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
          <p className="text-xl font-bold text-blue-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
