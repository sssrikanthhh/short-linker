"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UrlFormData, urlSchema } from "@/lib/schemas";
import { shortenUrl } from "@/actions/url/shorten-url";
import { Card, CardContent } from "../ui/card";

export default function UrlForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);
    setShortCode(null);
    try {
      const formData = new FormData();
      formData.append("url", data.url);

      const response = await shortenUrl(formData);
      if (response.success && response.data) {
        setShortUrl(response.data.shortUrl);
        // Extract the short code from the short URL
        const shortCode = response.data.shortUrl.match(/\/r\/([^/]+)$/);
        if (shortCode && shortCode[1]) {
          setShortCode(shortCode[1]);
        }
      }
    } catch (error) {
      setError("An error occurred, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Place your long url here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 size-4 animate-spin" />
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <span>Shorten</span>
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-sm p-3">
                <span>{error}</span>
              </div>
            )}

            {shortUrl && (
              <Card>
                <CardContent className="">
                  <p className="text-muted-foreground mb-1 text-left text-base font-medium">
                    Your shortened URL:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="w-full"
                    />
                    <Button
                      onClick={copyToClipboard}
                      type="button"
                      className="flex-shrink-0 cursor-pointer"
                      title="Copy to clipboard"
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="size-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
