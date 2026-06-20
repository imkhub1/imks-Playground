import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppStateProvider from "@/app/components/AppStateProvider";
import Navbar from "@/app/components/Navbar";
import ScrollToTop from "@/app/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "imk's Playground",
  description: "Play games online and compete for the highest score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div id="root" className="relative z-[1] flex-1 flex flex-col">
          <AppStateProvider>
            <ScrollToTop />
            <Navbar />
            <main>{children}</main>
          </AppStateProvider>
        </div>
      </body>
    </html>
  );
}
