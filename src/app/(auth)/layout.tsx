"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <section className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex w-full flex-col justify-center space-y-5 sm:w-[350px]">
          <header className="flex flex-col space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Welcome back!" : "Create an account"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Enter your email and password to continue."
                : "Register your details to continue."}
            </p>
          </header>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="capitalize">
                {isLogin ? "login" : "register"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your email and password to continue."
                  : "Enter your details to create an account."}
              </CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter className="justify-center">
              <p className="text-muted-foreground text-center text-xs">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  href={isLogin ? "/register" : "/login"}
                  className="text-primary underline underline-offset-3"
                >
                  {isLogin ? "Create an account" : "Login"}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
