"use client";

import { useState, Fragment, JSX } from "react";

interface Referral {
  id: string;
  name: string;
  email?: string;
  createdAt?: string;
  celphone?: string;
  status?: string;
  referrals: Referral[];
}

interface ReferralTableProps {
  readonly referrals: Referral[];
}

export function ReferralTable({ referrals }: ReferralTableProps) {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Formatea la fecha a formato colombiano (Año, Mes y Día)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Función para obtener el texto del nivel según el valor de "level"
  const getNivelText = (level: number): string => {
    if (level === 0) return "Primer nivel";
    if (level === 1) return "Segundo nivel";
    if (level === 2) return "Tercer nivel";
    return `Nivel ${level + 1}`;
  };

  // Función recursiva para renderizar las filas de la tabla
  const renderRows = (
    referrals: Referral[],
    level: number = 0
  ): JSX.Element[] => {
    // Ordenamos los referidos por fecha de creación (más antiguo a más reciente)
    const sortedReferrals = referrals.slice().sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });

    return sortedReferrals.map((referral) => (
      <Fragment key={referral.id}>
        <tr className="border-b">
          {/* Columna para el nombre con indentación */}
          <td className="p-2 text-black border">
            <div
              style={{ paddingLeft: `${level * 20}px` }}
              className="flex items-center text-black"
            >
              {referral.referrals.length > 0 && (
                <button
                  onClick={() => toggleRow(referral.id)}
                  className="mr-2 focus:outline-none"
                >
                  {expandedRows[referral.id] ? "▼" : "▶"}
                </button>
              )}
              <span className="font-medium text-black">{referral.name}</span>
            </div>
          </td>
          {/* Columna para mostrar el nivel */}
          <td className="p-2 text-black border">{getNivelText(level)}</td>
          <td className="p-2 text-black border">{referral.email ?? "-"}</td>
          <td className="p-2 text-black border">
            {formatDate(referral.createdAt)}
          </td>
          <td className="p-2 text-black border">{referral.celphone ?? "-"}</td>
          <td className="p-2 text-black border">{referral.status ?? "-"}</td>
        </tr>
        {expandedRows[referral.id] &&
          referral.referrals.length > 0 &&
          renderRows(referral.referrals, level + 1)}
      </Fragment>
    ));
  };

  return (
    <div className="p-4 bg-gray-50 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2 text-left border">Nombre</th>
            <th className="p-2 text-left border">Nivel</th>
            <th className="p-2 text-left border">Email</th>
            <th className="p-2 text-left border">Fecha de Creación</th>
            <th className="p-2 text-left border">Celular</th>
            <th className="p-2 text-left border">Estado</th>
          </tr>
        </thead>
        <tbody>{renderRows(referrals)}</tbody>
      </table>
    </div>
  );
}
