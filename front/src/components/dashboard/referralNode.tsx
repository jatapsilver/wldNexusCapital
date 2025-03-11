"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";

interface Node {
  id: string;
  name: string;
  referrals?: Node[];
}

const colors = [
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-red-500",
];

export function ReferralNode({
  node,
  level = 0,
}: {
  node: Node;
  level?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const referrals = node.referrals || [];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2">
        {/* Indicador visual del estado (no es clickeable) */}
        {referrals.length > 0 && (
          <span className="text-gray-600">
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
        )}
        {/* La imagen se convierte en el disparador para expandir/contraer */}
        <User
          onClick={() => setExpanded(!expanded)}
          className={`${
            colors[level % colors.length]
          } w-12 h-12 cursor-pointer`}
        />
        <span className="text-gray-800 font-medium">{node.name}</span>
      </div>
      {expanded && referrals.length > 0 && (
        <div
          id={`referral-list-${node.id}`}
          className="flex justify-center items-start mt-4 space-x-8"
        >
          {referrals.map((child) => (
            <ReferralNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente contenedor para el árbol, que incluye el control de zoom y scroll horizontal
export function ReferralTree({ root }: { root: Node }) {
  const [scale, setScale] = useState(1);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4">
        <label htmlFor="zoom-slider" className="mr-2 font-medium">
          Zoom:
        </label>
        <input
          id="zoom-slider"
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="accent-blue-500"
        />
      </div>
      {/* Contenedor con scroll horizontal */}
      <div className="overflow-x-auto w-full">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
          className="flex justify-center w-max"
        >
          <ReferralNode node={root} />
        </div>
      </div>
    </div>
  );
}
