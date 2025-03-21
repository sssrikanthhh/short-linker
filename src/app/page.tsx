"use client";

import UrlForm from "@/components/url/url-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <section className="flex flex-1 flex-col items-center justify-center p-6 md:p-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Shorten links in seconds with Short Linker
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-justify text-base">
          The Ultimate URL Shortening Platform with Smart AI Protection.
          Effortlessly shorten and manage your links while ensuring safety and
          reliability with advanced AI-powered URL flagging. Transform long URLs
          into sleek, shareable links and keep them secure like never before.
        </p>

        <UrlForm />
      </div>
    </section>
  );
}
