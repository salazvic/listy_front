import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner'
import "./globals.css";
import { Providers } from "../providers/providers";
import { SocketProvider } from "@/providers/SocketProvider";
import AuthProvider from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Listy App",
  description: "Crea y comparte listas de compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg- min-h-screen bg-[#33415c]`}>
        <Toaster richColors/>
        <Providers>
          <SocketProvider>
            <main className="max-w-7xl mx-auto px-4 py-6">
              {children}
            </main>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
