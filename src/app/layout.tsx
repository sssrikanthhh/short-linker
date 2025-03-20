import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/providers/toast-provider";
import AuthProvider from "@/components/providers/auth-provider";

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
        <AuthProvider>
          <ToastProvider />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
