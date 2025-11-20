import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add the weights you need
  display: "swap",
});
export const metadata: Metadata = {
  title: "Office Box",
  description:
    "Welcome to OfficeBox, the leading destination for co-working, software development, and tech innovation in Nigeria. We go beyond being a traditional workspace – we are a dynamic platform that encourages collaboration, creativity, and connectivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
