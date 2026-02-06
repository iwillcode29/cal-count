import type { Metadata } from "next";
import { Chakra_Petch, Space_Mono } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cal Count - นับแคลอรี่",
  description: "แอปนับแคลอรี่ง่ายๆ สำหรับคนไทย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${chakraPetch.variable} ${spaceMono.variable} font-[family-name:var(--font-thai)] antialiased`}
      >
        <main className="min-h-dvh max-w-md mx-auto px-4 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
