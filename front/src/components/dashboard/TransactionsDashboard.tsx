import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { createUserWithdrawal } from "../../server/dashboard/transactions/postCreateUserWithdrawal";
import { getUserTrasictionHistory } from "../../server/dashboard/transactions/getCreateUserTrasictionHistory";

type Transaction = {
  uuid: string;
  description: string;
  value: number;
  balance: number;
  date: string;
};

type Withdrawal = {
  uuid: string;
  amount: number;
  walletAddress: string;
  status: string;
  createdAt: string;
  completedAt: string;
};

type ApiResponse = {
  userTransactions: Transaction[];
  withdrawalHistory: Withdrawal | null;
};

export function TransactionsDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para manejar el modo de retiro, el valor a retirar y el estado del envío
  const [isWithdrawalMode, setIsWithdrawalMode] = useState(false);
  const [withdrawalValue, setWithdrawalValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para obtener y actualizar el historial de transacciones y retiros
  async function fetchHistory() {
    setLoading(true);
    const userId = localStorage.getItem("sub");
    if (!userId) {
      console.error("User ID is null");
      setLoading(false);
      return;
    }
    const data: ApiResponse | null = await getUserTrasictionHistory(userId);
    if (data) {
      const txs = data.userTransactions.map((tx) => ({
        ...tx,
        value: parseFloat(tx.value as unknown as string),
        balance: parseFloat(tx.balance as unknown as string),
      }));
      setTransactions(txs);

      if (data.withdrawalHistory) {
        const parsedWithdrawal = {
          ...data.withdrawalHistory,
          amount: parseFloat(
            data.withdrawalHistory.amount as unknown as string
          ),
        };
        setWithdrawal(parsedWithdrawal);
      } else {
        setWithdrawal(null);
      }
    }
    setLoading(false);
  }

  // Cargar el historial al montar el componente
  useEffect(() => {
    fetchHistory();
  }, []);

  // Calcular el balance acumulado
  let computedTransactions: (Transaction & { computedBalance: number })[] = [];
  let runningBalance = 0;
  if (transactions.length > 0) {
    computedTransactions = [...transactions]
      .reverse()
      .map((tx) => {
        runningBalance += tx.value;
        return { ...tx, computedBalance: runningBalance };
      })
      .reverse();
  }

  const currentBalance =
    computedTransactions.length > 0
      ? computedTransactions[0].computedBalance
      : 0;

  // Función para manejar el envío de la solicitud de retiro
  const handleWithdrawalSubmit = async () => {
    if (!withdrawalValue || isNaN(parseFloat(withdrawalValue))) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa un valor válido",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Convertir el valor ingresado a un número negativo
    let amount = parseFloat(withdrawalValue);
    amount = -Math.abs(amount); // Se asegura que sea negativo

    const userId = localStorage.getItem("sub");
    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el ID de usuario",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setIsSubmitting(true);
    await createUserWithdrawal(userId, {
      description: "solicitud de retiro",
      value: amount.toString(), // Enviamos el valor como string
    });
    setIsSubmitting(false);
    setIsWithdrawalMode(false);
    setWithdrawalValue("");

    // Llamamos a fetchHistory para actualizar los datos
    fetchHistory();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Imagen de Portada */}
      <div className="w-full relative">
        <Image
          src="/dashboard/coverTransactions.jpg"
          alt="User Cover"
          width={1080}
          height={400}
          className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
        />
      </div>

      {/* Imagen de Perfil */}
      <div className="relative -mt-20 md:-mt-32">
        <Image
          src="/dashboard/wallet.svg"
          alt="Wallet Icon"
          width={240}
          height={150}
          className="rounded-full object-cover border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem]"
        />
      </div>

      {/* Balance General y Botón de Retiro / Input */}
      <div className="w-full max-w-4xl bg-gray-100 rounded-lg p-4 shadow-md flex justify-between items-center mt-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Balance General:{" "}
          <span
            className={`font-bold ${
              currentBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${currentBalance.toFixed(2)}
          </span>
        </h3>
        {isWithdrawalMode ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              step="0.01"
              placeholder="Valor a retirar"
              value={withdrawalValue}
              onChange={(e) => setWithdrawalValue(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-black"
            />
            <button
              onClick={handleWithdrawalSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsWithdrawalMode(true)}
            disabled={withdrawal !== null}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md ${
              withdrawal !== null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Solicitar Retiro
          </button>
        )}
      </div>

      {withdrawal && (
        <div className="relative w-full max-w-4xl bg-white rounded-lg p-4 md:p-8 shadow-md mb-4">
          {/* Título centrado */}
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-black">
            Proceso de Retiro en Proceso
          </h3>

          {/* Monto y Wallet Address centrados */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl md:text-3xl font-semibold mb-2 text-green-600">
              ${withdrawal.amount.toFixed(2)}
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-4">
              <strong>Wallet de Retiro:</strong> {withdrawal.walletAddress}
            </p>
          </div>

          {/* Fecha de creación */}
          <div className="text-sm text-gray-600 mt-4 md:absolute md:bottom-4 md:right-4">
            <strong>Fecha de creación:</strong>{" "}
            {new Date(withdrawal.createdAt).toLocaleString("es-CO", {
              timeZone: "America/Bogota",
            })}
          </div>
        </div>
      )}

      {/* Título de Transacciones */}
      <h2 className="text-2xl font-bold mt-4 text-black">Transacciones</h2>

      {/* Tabla de Transacciones */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Descripción</th>
              <th className="p-2 text-right">Valor ($)</th>
              <th className="p-2 text-right">Balance ($)</th>
            </tr>
          </thead>
          <tbody>
            {computedTransactions.map((tx, index) => (
              <tr key={tx.uuid || index} className="border-b border-gray-200">
                <td className="p-2 text-black">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="p-2 text-black">{tx.description}</td>
                <td
                  className={`p-2 text-right ${
                    tx.value < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {tx.value.toFixed(2)}
                </td>
                <td className="p-2 text-right font-bold text-black">
                  {tx.computedBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
