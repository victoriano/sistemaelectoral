import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body className={`${instrumentSerif.variable} ${dmSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
