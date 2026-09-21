import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Radio Gmais - Sua Rádio Exclusiva",
  description: "Sistema de gerenciamento de rádio com locutor virtual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col" style={{ background: '#111217', color: '#e5e7eb' }}>
        {children}
      </body>
    </html>
  );
}
