import React, { useEffect, useState } from "react";
import { getUserPackageProgress } from "../../server/dashboard/packages/getUserPackageProgress";
import { PackagesBuy } from "../dashboard/packagesBuy";

interface Package {
  uuid: string;
  name: string;
  price: string;
}

interface Order {
  uuid: string;
  purchaseDate: string;
  walletPrivate: string;
  status: string;
  transactionHash?: string | null;
  package: Package;
}

interface PackageData {
  uuid: string;
  startDate: string;
  initialValue: string;
  finalValue: string;
  percentage: string;
  endDate?: string | null;
  status: string;
  order: Order;
}

const PackageCard = ({ packageData }: { packageData: PackageData }) => {
  const { startDate, initialValue, finalValue, percentage, status, order } =
    packageData;
  const pkg = order.package;

  return (
    <div className="bg-gray-200 shadow-lg rounded-3xl overflow-hidden p-6 m-4 ">
      <div className="flex flex-col md:justify-between text-center items-center mb-4">
        <h3 className="text-4xl font-bold text-center items-center text-blue-600">
          {pkg.name.toUpperCase()}
        </h3>
        <span className="text-xl text-blue-600">
          Usdt: ${parseFloat(pkg.price).toLocaleString("es-ES")}
        </span>
      </div>
      <div className="flex flex-col md:justify-center items-center">
        <h3 className="text-3xl font-bold text-blue-600">
          {status.replace("_", " ").toUpperCase()}
        </h3>
      </div>
      <div>
        <div className="flex justify-center">
          <span className="text-sm text-gray-500">
            Fecha de inicio: {new Date(startDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center text-center md:flex-row md:justify-between text-gray-700 space-y-2">
        <p className="text-black">
          <strong>Progreso:</strong> $
          {parseFloat(initialValue).toLocaleString("es-ES")}
        </p>
        <p className="text-black">
          <strong>Porcentaje:</strong> {percentage}%
        </p>
        <p className="text-black">
          <strong>Valor Final:</strong> $
          {parseFloat(finalValue).toLocaleString("es-ES")}
        </p>
      </div>
    </div>
  );
};

export const PackageUser = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPackageUuid, setUserPackageUuid] = useState<string | undefined>(
    undefined
  );

  const userId = localStorage.getItem("sub") ?? "";

  // Función para refrescar la información
  const fetchData = async () => {
    setLoading(true);
    const userId = localStorage.getItem("sub");
    if (!userId) {
      console.error("No se encontró el userId en localStorage");
      setLoading(false);
      return;
    }

    try {
      const data = await getUserPackageProgress(userId);
      if (data && Array.isArray(data)) {
        setPackages(data);
        if (data.length > 0) {
          setUserPackageUuid(data[0].order.package.uuid);
        } else {
          setUserPackageUuid(undefined);
        }
      } else {
        setPackages([]);
        setUserPackageUuid(undefined);
      }
    } catch (error) {
      console.error("Error al obtener los paquetes:", error);
      setPackages([]);
      setUserPackageUuid(undefined);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 w-4/5">
      {loading && <div className="text-center text-gray-700">Cargando...</div>}

      {!loading && packages.length === 0 && (
        <h1 className="text-xl md:text-4xl text-center text-black mb-5">
          No tienes paquetes activos
        </h1>
      )}

      <div className="w-full ">
        {packages.length > 0 &&
          packages.map((pkg) => (
            <PackageCard key={pkg.uuid} packageData={pkg} />
          ))}
      </div>

      <div className="w-full">
        {/* Se pasa la función fetchData como callback para refrescar */}
        <PackagesBuy
          userPackageUuid={userPackageUuid}
          userId={userId}
          onRefresh={fetchData}
        />
      </div>
    </div>
  );
};
