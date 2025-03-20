"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Copy, Loader, QrCode } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

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
import FormError from "../form/form-error";
import QrCodeModal from "../modals/qr-code-modal";
import { UrlSafetyCheck } from "@/lib/types";

export default function UrlForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [flaggedInfo, setFlaggedInfo] = useState<
    | (Pick<UrlSafetyCheck, "flagged" | "reason"> & {
        message?: string;
      })
    | null
  >(null);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);
    setShortCode(null);
    setFlaggedInfo(null);

    try {
      const formData = new FormData();
      formData.append("url", data.url);

      if (data.customCode && data.customCode.trim() !== "") {
        formData.append("customCode", data.customCode.trim());
      }

      const response = await shortenUrl(formData);
      if (response.success && response.data) {
        setShortUrl(response.data.shortUrl);
        // Extract the short code from the short URL
        const shortCodeMatch = response.data.shortUrl.match(/\/sl\/([^/]+)$/);
        if (shortCodeMatch && shortCodeMatch[1]) {
          setShortCode(shortCodeMatch[1]);
        }
        if (response.data.flagged) {
          setFlaggedInfo({
            flagged: response.data.flagged,
            reason: response.data.flagReason || null,
            message: response.data.message,
          });
          toast.warning(response.data.message || "URL flagged as unsafe.", {
            description: response.data.flagReason || "URL is not safe.",
          });
        } else {
          toast.success("URL shortened successfully.");
        }
      }

      if (response.error) {
        setError(response.error || "An error occurred, try again.");
      }
      if (session?.user && pathname.includes("/dashboard")) {
        router.refresh();
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
      toast("Copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  const showQrCode = () => {
    if (!shortUrl || !shortCode) return;
    console.log("test");
    setIsQrCodeModalOpen(true);
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

            <FormField
              name="customCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-0.5">
                      <span className="text-muted-foreground text-sm">
                        {process.env.NEXT_PUBLIC_APP_URL ||
                          window.location.origin}
                        /sl/
                      </span>
                      <Input
                        placeholder="Enter your custom code(optional)"
                        {...field}
                        type="text"
                        onChange={(e) => {
                          field.onChange(e.target.value || "");
                        }}
                        value={field.value || ""}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error as string} />

            {shortUrl && (
              <Card>
                <CardContent>
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
                      <span className="hidden md:block">Copy</span>
                    </Button>
                    <Button
                      onClick={showQrCode}
                      type="button"
                      className="flex-shrink-0 cursor-pointer"
                      title="Generate QR code"
                      size="sm"
                      variant="outline"
                    >
                      <QrCode className="size-4" />
                      <span className="hidden md:block">QR Code</span>
                    </Button>
                  </div>
                  {/* flagged info */}
                  {flaggedInfo && flaggedInfo.flagged && (
                    <div className="mt-3 rounded-md border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <div className="flex !items-start gap-2">
                        <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
                        <div className="text-justify">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            This URL has been flagged as unsafe and up for
                            review.
                          </p>
                          <p className="dark:text-yellow-400400 mt-1 text-xs text-yellow-700">
                            {flaggedInfo.message ||
                              "This URL is marked for review and will be reviewed by the administrator, before it becomed fully accessible."}
                          </p>
                          {flaggedInfo.reason && (
                            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                              <span className="font-medium text-yellow-800 dark:text-yellow-300">
                                Reason:
                              </span>{" "}
                              {flaggedInfo.reason || "Unknwon reason."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
      {shortUrl && shortCode && (
        <QrCodeModal
          isOpen={isQrCodeModalOpen}
          onOpenChange={setIsQrCodeModalOpen}
          url={shortUrl}
          shortCode={shortCode}
        />
      )}
    </>
  );
}
