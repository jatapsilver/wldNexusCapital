"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Readonly<{
  children: React.ReactNode;
  allowedRoles: string[];
}>) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const token = localStorage.getItem("token");
    const userProfile = localStorage.getItem("profile");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!userProfile || !allowedRoles.includes(userProfile)) {
      router.push("/login");
      return;
    }
  }, [router, allowedRoles]);

  if (!isClient) return null;

  return <>{children}</>;
}
