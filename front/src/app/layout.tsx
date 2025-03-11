// app/layout.tsx
"use client";

import { Sora } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Head from "next/head";

// Components
import Nav from "../components/Nav";
import Header from "../components/Header";
import TopLeftImg from "../components/TopLeftImg";

// font Settings
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("dashboard") || pathname.includes("dashboardAdmin");

  return (
    <html lang="es">
      <Head>
        <meta
          name="description"
          content="WLD Nexus Capital es una empresa innovadora especializada en la gestión estratégica de capital y en la creación de nodos dentro del ecosistema de la criptomoneda WLD. Su misión es potenciar la adopción y crecimiento de WLD mediante soluciones tecnológicas avanzadas y una administración de inversiones orientada a la sostenibilidad y la eficiencia"
        />
        <meta name="title" content="WLD Nexus Capital" />
      </Head>
      <body
        className={`page bg-site text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}
      >
        {!isDashboardPage && <TopLeftImg />}
        {!isDashboardPage && <Nav />}
        {!isDashboardPage && <Header />}
        {children}
      </body>
    </html>
  );
}
