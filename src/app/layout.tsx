import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/providers/toast-provider";

export const metadata: Metadata = {
  title: "Short Linker",
  description:
    "Shorten links in seconds with Short Linker, security provided by the power of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <main>{children}</main>
      </body>
    </html>
  );
}
