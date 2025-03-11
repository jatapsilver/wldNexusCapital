import React, { useState, useEffect } from "react";
import { getCancelledPurchaseOrder } from "../../server/dashboard/packages/cancelledPurchaseOrder";
import { getAllUserHashes } from "../../server/dashboard/packages/getAllUserHashes";
import QRCode from "react-qr-code";
import { getTransactionList } from "../../server/dashboard/packages/getTransaction";
import { userCompletedOrder } from "../../server/dashboard/packages/postUserCompletedOrder";

interface Package {
  uuid: string;
  name: string;
  price: string;
}

interface Transaction {
  uuid: string;
  purchaseDate: string;
  walletPrivate: string;
  status: string;
  transactionHash: string;
  value: string;
  hash?: string;
}

interface OrderResponse {
  message: string;
  walletPrivate?: string;
  status: string;
  package: Package;
}

interface QrPaymentsProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export const QrPayments = ({ order, onClose }: QrPaymentsProps) => {
  const userId = localStorage.getItem("sub") ?? "";

  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<Transaction | null>(null);
  const [userHashes, setUserHashes] = useState<string[]>([]);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Dirección");
  const [paymentReceived, setPaymentReceived] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setError(null);

    if (!userId) {
      setError("No se encontró el ID del usuario.");
      setIsCancelling(false);
      return;
    }

    try {
      const result = await getCancelledPurchaseOrder(userId);
      if (result) {
        onClose();
      } else {
        setError("Error al cancelar la orden.");
      }
    } catch {
      setError("Error al cancelar la orden.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRealizarPago = async () => {
    setIsLoadingPayment(true);
    setError(null);

    if (!userId) {
      setError("No se encontró el ID del usuario.");
      setIsLoadingPayment(false);
      return;
    }

    try {
      const result: Transaction[] = await getAllUserHashes(userId);
      console.log("Hashes de usuario:", result);
      const hashes = result.map((tx) => tx.transactionHash);
      setUserHashes(hashes);

      if (order?.walletPrivate) {
        const paymentInfo: Transaction = {
          uuid: "dummy",
          purchaseDate: "",
          walletPrivate: order.walletPrivate,
          status: "",
          transactionHash: "",
          value: "0",
        };
        setPaymentData(paymentInfo);
      } else {
        setError("No se encontró información de pago.");
      }
    } catch {
      setError("Error al obtener la información de pago.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  useEffect(() => {
    if (paymentData && order && !paymentReceived) {
      const interval = setInterval(async () => {
        try {
          const data = await getTransactionList(paymentData.walletPrivate);
          const transactions = data.result;

          if (Array.isArray(transactions)) {
            for (const tx of transactions) {
              const txHash = tx.hash;
              //  (1e6 es el parametro completo para obtener el precio correcto de la blockchain)
              console.log(transactions);
              if (
                parseFloat(tx.value) / 1e6 >= parseFloat(order.package.price) &&
                !userHashes.includes(txHash)
              ) {
                console.log("Hash guardado:", txHash);
                setUserHashes((prevHashes) => [...prevHashes, txHash]);

                const result = await userCompletedOrder(userId, txHash);
                if (result) {
                  setPaymentReceived(true);
                  clearInterval(interval);
                  onClose();
                  break;
                }
              }
            }
          } else {
            console.error("El campo result no es un arreglo:", transactions);
          }
        } catch (err) {
          console.error("Error fetching transaction list during polling:", err);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [paymentData, order, userHashes, paymentReceived, onClose, userId]);

  if (!order) return null;

  if (paymentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto text-black">
          <h2 className="text-xl font-bold text-center mb-4">
            Información de Pago
          </h2>
          <p className="text-black text-center">
            <strong>Dirección Wallet:</strong> {paymentData.walletPrivate}
          </p>
          <p className="text-black text-center">
            <strong>
              {order.package.name} -{" "}
              {parseFloat(order.package.price).toLocaleString("es-ES")} Usdt
            </strong>
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(paymentData.walletPrivate);
                setCopyButtonText("Copiado");
                setTimeout(() => {
                  setCopyButtonText("Copiar Dirección");
                }, 2000);
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition transform hover:scale-105 duration-200"
            >
              {copyButtonText}
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <QRCode value={paymentData.walletPrivate} size={200} />
          </div>
        </div>
      </div>
    );
  }

  // Vista inicial
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-center mb-4 text-black">
          {order.message}
        </h2>
        <div className="mt-4 text-black text-center">
          <h3 className="font-bold">Información del Paquete</h3>
          <p className="text-black">
            <strong>Nombre:</strong> {order.package.name}
          </p>
          <p className="text-black">
            <strong>Precio:</strong>{" "}
            {parseFloat(order.package.price).toLocaleString("es-ES")} Usdt
          </p>
        </div>
        <div className="mt-4 text-black text-center">
          <h3 className="font-bold">Recomendaciones</h3>
          <ul>
            <li className="mb-2">
              1. Utilizar la red de Optimism (OP Mainnet)
            </li>
            <li className="mb-2">
              2. Enviar cantidades inferiores al valor de la membresia puede
              terminar en la pérdida de tus fondos
            </li>
            <li>
              3. No cierres la página después de realizar el pago hasta la
              confirmación de recibido
            </li>
            <li>
              4. Enviar siempre un dolar adicional para cubrir comisiones de
              exchanges
            </li>
          </ul>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={handleRealizarPago}
            disabled={isLoadingPayment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isLoadingPayment ? "Procesando..." : "Realizar Pago"}
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {isCancelling ? "Cancelando..." : "Cancelar Orden"}
          </button>
        </div>
      </div>
    </div>
  );
};
