import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserDashboardData } from "@/server/dashboard/start/getUserStartDashboardData";

export function StartDashboard() {
  interface DashboardData {
    [0]: { percentage: number };
    [1]: number;
    [2]: { date: string; value: number; description: string }[];
    [3]: {
      createdAt: string;
      amount: number;
      walletAddress: string;
      status: string;
    }[];
    [4]: { createdAt: string; name: string; email: string }[];
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const username = localStorage.getItem("username") ?? " ";
  const profile = localStorage.getItem("profile");
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("sub");
      if (userId) {
        const data = await getUserDashboardData(userId);
        setDashboardData(data);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(username).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Mensaje temporal
    });
  };

  if (!dashboardData) {
    return <div>Cargando...</div>;
  }

  const progress = dashboardData[0];
  const balance = dashboardData[1];
  const lastTransactional = dashboardData[2];
  const lastWithdrawals = dashboardData[3];
  const lastRegisters = dashboardData[4];
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="w-full relative">
          <Image
            src="/dashboard/coverStart2.jpg"
            alt="User Cover"
            width={1080}
            height={400}
            className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
          />
        </div>
        <div className="relative -mt-32">
          <Image
            src="/dashboard/hexagon.svg"
            alt=""
            width={240}
            height={150}
            className="rounded-full object-cover border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem] object-cover"
          />
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div
          className="rounded-3xl bg-blue-900 text-white p-6 flex flex-col justify-center items-start gap-2 transition-all duration-500 hover:-translate-y-1  
                    after:bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)]"
        >
          <div className="w-full flex flex-col justify-center items-center text-center ">
            <h1 className="text-3xl font-bold ">Tu Código de Referido</h1>
            <p className="break-words w-64 p-3 text-white text-2xl">
              {username}
            </p>
            <Button
              onClick={handleCopy}
              className="hover:scale-80 transition-transform duration-300 bg-black px-4 py-2 rounded-lg"
            >
              {copied ? "Copiado!" : "Copiar Código"}
            </Button>
          </div>
        </div>

        <div
          className="relative rounded-3xl bg-blue-900 text-white p-6 flex flex-col justify-center items-start gap-2 transition-all duration-500 hover:-translate-y-1  
            after:bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)]"
        >
          <div className="w-full flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold mb-3">Tu progreso</h1>

            <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700 sm:mb-2">
              <div
                className="bg-green-600 h-6 rounded-full transition-all duration-500"
                style={{
                  width: (() => {
                    if (profile === "ambassador") {
                      return "100%";
                    } else if (progress) {
                      return `${progress.percentage}%`;
                    } else {
                      return "0%";
                    }
                  })(),
                }}
              ></div>
            </div>

            <span className="text-lg font-medium text-white mt-2">
              {(() => {
                if (profile === "ambassador") {
                  return "Sin límite de comisiones";
                } else if (progress) {
                  return `${progress.percentage} %`;
                } else {
                  return "No tienes paquetes activos en el momento";
                }
              })()}
            </span>
          </div>
        </div>

        <div
          className="relative rounded-3xl bg-blue-900 text-white p-6 flex flex-col justify-center items-start gap-2 transition-all duration-500 hover:-translate-y-1  
                        after:bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] "
        >
          <div className="w-full flex flex-col justify-center items-center text-center ">
            <h1 className="text-3xl font-bold ">Tu balance</h1>
            <p className="break-words w-64 p-3 text-white text-4xl font-bold">
              $ {balance}
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative h-full rounded-3xl bg-blue-900 text-white p-6 flex flex-col justify-start items-start gap-2 transition-all duration-500 hover:-translate-y-1  
        after:bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] "
      >
        <div className="w-full flex flex-col items-start text-left gap-4 ">
          <h1 className="text-3xl font-bold">Tus últimas Actualizaciones</h1>

          {/* Transacciones Recientes */}
          <div className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Transacciones Recientes
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Monto</th>
                  <th className="p-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {lastTransactional.length > 0 ? (
                  lastTransactional.map((transaction) => (
                    <tr
                      key={transaction.date + transaction.value}
                      className="border-b border-gray-600"
                    >
                      <td className="p-2">
                        {new Date(transaction.date).toLocaleDateString("es-CO")}
                      </td>
                      <td className="p-2"> $ {transaction.value}</td>
                      <td className="p-2">{transaction.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-4 text-center text-white text-xl"
                    >
                      Todavía no tienes transacciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Retiros Recientes */}
          <div className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Historial de Retiros</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Monto</th>
                  <th className="p-2">WalletRetiro</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(lastWithdrawals) &&
                lastWithdrawals.length > 0 ? (
                  lastWithdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.createdAt + withdrawal.walletAddress}
                      className="border-b border-gray-600"
                    >
                      <td className="p-2">
                        {new Date(withdrawal.createdAt).toLocaleDateString(
                          "es-CO"
                        )}
                      </td>
                      <td className="p-2">${withdrawal.amount}</td>
                      <td className="p-2">{withdrawal.walletAddress}</td>
                      <td
                        className={`p-2 ${(() => {
                          if (withdrawal.status === "processing") {
                            return "text-yellow-500";
                          } else if (withdrawal.status === "completed") {
                            return "text-green-500";
                          } else {
                            return "";
                          }
                        })()}`}
                      >
                        {withdrawal.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-white text-xl"
                    >
                      Todavía no tienes solicitudes de retiro
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Registros Recientes */}
          <div className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Usuarios Registrados</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Correo Electrónico</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(lastRegisters) && lastRegisters.length > 0 ? (
                  lastRegisters.map((user) => (
                    <tr key={user.email} className="border-b border-gray-600">
                      <td className="p-2">
                        {new Date(user.createdAt).toLocaleDateString("es-CO")}
                      </td>
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-4 text-center text-white text-xl"
                    >
                      Todavía no tienes usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
