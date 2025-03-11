"use client";
import { useEffect, useState } from "react";
import { getAllPackages } from "../../server/dashboard/packages/getAllPackages";
import { createPurchaseOrder } from "../../server/dashboard/packages/createPurchaseOrder";
import { QrPayments } from "../dashboard/qrPayment";
import {
  RxPencil2,
  RxDesktop,
  RxReader,
  RxTrackNext,
  RxMix,
  RxAllSides,
  RxGlobe,
  RxGear,
  RxShuffle,
  RxCodesandboxLogo,
} from "react-icons/rx";
import { IconType } from "react-icons";

interface Package {
  uuid: string;
  name: string;
  price: string;
}

interface OrderResponse {
  message: string;
  walletPrivate?: string;
  status: string;
  package: Package;
}

interface PackagesBuyProps {
  userPackageUuid?: string;
  userId: string;
  onRefresh: () => void; // Callback para refrescar la información
}

const iconMap: Record<string, IconType> = {
  Starter: RxTrackNext,
  Assistant: RxPencil2,
  "Smart Bot": RxMix,
  Vision: RxDesktop,
  "Tools IA": RxReader,
  Automation: RxAllSides,
  Cloud: RxGlobe,
  "Generador IA": RxGear,
  DeepLearn: RxShuffle,
  Quantum: RxCodesandboxLogo,
};

export const PackagesBuy = ({
  userPackageUuid,
  userId,
  onRefresh,
}: PackagesBuyProps) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPackage, setUserPackage] = useState<Package | null>(null);
  const [purchaseResponse, setPurchaseResponse] =
    useState<OrderResponse | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      const data = await getAllPackages();
      if (data) {
        const sortedPackages = data.sort(
          (a: Package, b: Package) => parseFloat(a.price) - parseFloat(b.price)
        );
        setPackages(sortedPackages);
        if (userPackageUuid) {
          const activePackage = sortedPackages.find(
            (pkg: Package) => pkg.uuid === userPackageUuid
          );
          setUserPackage(activePackage || null);
        }
      } else {
        setError("No se pudieron cargar los paquetes");
      }
      setLoading(false);
    };

    fetchPackages();
  }, [userPackageUuid]);

  // Función para manejar la compra del paquete
  const handlePurchase = async (pkg: Package) => {
    const response = await createPurchaseOrder(userId, pkg.uuid);
    if (response) {
      let orderData: OrderResponse | undefined;

      if (response.order) {
        orderData = {
          message: response.message,
          walletPrivate: response.order.walletPrivate,
          status: response.order.status,
          package: response.order.package,
        };
      } else if (response.orderExisting && response.orderExisting.length > 0) {
        orderData = {
          message: response.message,
          walletPrivate: response.orderExisting[0].walletPrivate,
          status: response.orderExisting[0].status,
          package: response.orderExisting[0].package,
        };
      }
      if (orderData) {
        setPurchaseResponse(orderData);
        setShowModal(true);
      }
    }
  };

  if (loading) return <p className="text-black">Cargando paquetes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {packages.map((pkg) => {
          const Icon = iconMap[pkg.name] || RxCodesandboxLogo;
          const isLowerPackage =
            userPackage &&
            parseFloat(pkg.price) < parseFloat(userPackage.price);

          return (
            <div
              key={pkg.uuid}
              className={`shadow-lg p-6 rounded-xl flex flex-col items-center border text-center mx-auto w-full ${
                isLowerPackage
                  ? "bg-gray-300 text-gray-500 border-gray-400"
                  : "bg-white border-gray-300"
              }`}
            >
              <Icon
                className={`text-6xl mb-4 ${
                  isLowerPackage ? "text-gray-500" : "text-blue-600"
                }`}
              />
              <h2 className="text-xl font-bold text-gray-900">{pkg.name}</h2>
              <p className="text-lg font-medium text-gray-700">
                ${parseFloat(pkg.price).toLocaleString("es-ES")}
              </p>
              <button
                onClick={() => handlePurchase(pkg)}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                  isLowerPackage
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isLowerPackage ?? false}
              >
                {userPackage ? "Upgrade" : "Adquirir paquete"}
              </button>
            </div>
          );
        })}
      </div>
      {showModal && (
        <QrPayments
          order={purchaseResponse}
          onClose={() => {
            setShowModal(false);
            // Al cerrar el modal se refresca la información
            onRefresh();
          }}
        />
      )}
    </>
  );
};
