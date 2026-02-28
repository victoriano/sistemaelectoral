import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Método GIME - Sistema Electoral Biproporcional",
  description: "Simulador interactivo del Método GIME para el reparto proporcional de escaños en sistemas electorales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="corporate">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
