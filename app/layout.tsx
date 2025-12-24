import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "廃棄物見える化システム | Waste Visualization Demo",
  description: "建設業向け廃棄物管理KPI可視化システム - 現場・支店・全社の3階層でリアルタイムに廃棄物管理状況を把握",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
