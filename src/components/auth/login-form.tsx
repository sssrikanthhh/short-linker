"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { LoginFormData, loginSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FormError from "../form/form-error";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const registered = searchParams.get("registered");
  let hasToastShown = false;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid credentials.");
        toast.error("Invalid credentials.", {
          description: "Please check your email and password.",
        });
        return;
      }

      toast.success("Login successful.", {
        description: "You are now logged in successfully.",
      });

      router.replace("/dashboard");
    } catch (error) {
      setError("An error occurred, Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("github", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      setError(error as string);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      setError(error as string);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //check if registered is true and show toast
  useEffect(() => {
    if (registered === "true") {
      if (!hasToastShown) {
        toast.success("Registration successful.", {
          description: "You can now login with your credentials.",
        });
        hasToastShown = true;
      }
    }

    //remove the query param
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("registered");
    router.replace(
      `${window.location.pathname}?${newUrl.searchParams.toString()}`,
    );
  }, [registered]);

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={handleGithubSignIn}
        >
          <FaGithub className="size-4" />
          Continue with Github
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <FaGoogle className="size-4" />
          Continue with Google
        </Button>
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex items-center justify-center">
          <span className="bg-background text-muted-foreground px-2 text-xs font-medium uppercase">
            or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eaxample@example.com"
                    type="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    type="password"
                    {...field}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error as string} />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
