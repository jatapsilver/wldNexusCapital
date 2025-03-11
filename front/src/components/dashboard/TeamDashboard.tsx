"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserInformationReferred } from "../../server/dashboard/team/getUserInformationReferred";
import { ReferralTable } from "./referralTable";
import { ReferralNode } from "./referralNode";

// Interfaces para tipar la información del API y el árbol de referidos
interface ApiUser {
  uuid: string;
  name: string;
  email?: string;
  createdAt?: string;
  celphone?: string;
  status?: string;
  sponsor?: string;
}

interface Referral {
  id: string;
  name: string;
  email?: string;
  createdAt?: string;
  celphone?: string;
  status?: string;
  referrals: Referral[];
}

interface ReferralApiResponse {
  firstLevel: ApiUser[];
  secondLevel: ApiUser[];
  thirdLevel: ApiUser[];
}

/**
 * Función que transforma la respuesta del API en un árbol de referidos,
 * incluyendo además los campos adicionales para la tabla.
 */
function buildReferralTree(data: ReferralApiResponse): Referral[] {
  // Creamos un mapa para los usuarios de primer nivel
  const firstLevelMap: Record<string, Referral> = {};
  data.firstLevel.forEach((user) => {
    firstLevelMap[user.uuid] = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      celphone: user.celphone,
      status: user.status,
      referrals: [],
    };
  });

  // Procesamos el segundo nivel y lo agregamos como hijos del primer nivel
  const secondLevelMap: Record<string, Referral> = {};
  data.secondLevel.forEach((user) => {
    const node: Referral = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      celphone: user.celphone,
      status: user.status,
      referrals: [],
    };
    secondLevelMap[user.uuid] = node;
    if (firstLevelMap[user.sponsor as string]) {
      firstLevelMap[user.sponsor as string].referrals.push(node);
    }
  });

  // Procesamos el tercer nivel y lo agregamos como hijos del segundo nivel
  data.thirdLevel.forEach((user) => {
    const node: Referral = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      celphone: user.celphone,
      status: user.status,
      referrals: [],
    };
    if (secondLevelMap[user.sponsor as string]) {
      secondLevelMap[user.sponsor as string].referrals.push(node);
    }
  });

  return Object.values(firstLevelMap);
}

export function TeamDashboard() {
  const [activeComponent, setActiveComponent] = useState("referrals");
  const [referralRoot, setReferralRoot] = useState<Referral | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("sub");
    const fetchData = async () => {
      if (userId) {
        const data = await getUserInformationReferred(userId);
        if (data) {
          const tree = buildReferralTree(data);
          // Creamos un nodo raíz con nombre "Mis Referidos"
          setReferralRoot({
            id: "root",
            name: "Mis Referidos",
            referrals: tree,
          });
        }
      } else {
        console.error("User ID is null");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Banner de portada */}
      <div className="w-full relative">
        <Image
          src="/dashboard/coverTeam.jpg"
          alt="User Cover"
          width={1080}
          height={400}
          className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
        />
      </div>

      {/* Foto de perfil */}
      <div className="relative -mt-20 md:-mt-32">
        <Image
          src="/dashboard/users.svg"
          alt="User Profile"
          width={240}
          height={150}
          className="rounded-full object-cover border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem]"
        />
      </div>

      {/* Botones para cambiar de vista */}
      <div className="flex gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeComponent === "referrals"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveComponent("referrals")}
        >
          Tabla
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeComponent === "another"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveComponent("another")}
        >
          Árbol
        </button>
      </div>

      {/* Contenedor de contenido */}
      <div className="w-full mt-4">
        {referralRoot ? (
          <>
            {activeComponent === "referrals" ? (
              // Se le pasa la propiedad "referrals" con toda la información necesaria
              <ReferralTable referrals={referralRoot.referrals} />
            ) : (
              <div className="overflow-x-auto w-full">
                <div className="min-w-max">
                  <ReferralNode node={referralRoot} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div>Cargando información de referidos...</div>
        )}
      </div>
    </div>
  );
}
