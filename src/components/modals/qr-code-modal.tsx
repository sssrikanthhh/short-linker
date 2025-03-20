"use client";

import { useCallback, useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { toast } from "sonner";

import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Download, Loader } from "lucide-react";
import { Button } from "../ui/button";

type QrCodeModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  shortCode: string;
};

export default function QrCodeModal({
  isOpen,
  onOpenChange,
  url,
  shortCode,
}: QrCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQrCode = useCallback(async () => {
    if (!url) return;
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      toast.success("QR code generated successfully.");
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Failed to generate QR code: ", error);
      toast("Failed to generate QR code.");
    } finally {
      setIsGenerating(false);
    }
  }, [url]);

  useEffect(() => {
    if (isOpen && url) {
      generateQrCode();
    }
  }, [isOpen, url, generateQrCode]);

  const downloadQrCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `shortlink-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded successfully.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            QR Code for:{" "}
            <span className="text-muted-foreground text-sm">{url}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          {isGenerating ? (
            <div className="flex h-[300px] w-[300px] items-center justify-center">
              <Loader className="size-8 animate-spin" />
            </div>
          ) : qrCodeDataUrl ? (
            <div className="flex flex-col items-center gap-2">
              <Image
                src={qrCodeDataUrl}
                alt="QR Code"
                width={300}
                height={300}
                className="rounded-md border"
                unoptimized
              />
              <p className="text-muted-foreground text-center text-sm">
                Scan this QR code to visit the shortened URL.
              </p>
              <Button className="w-full" onClick={downloadQrCode}>
                <Download className="mr-1 size-4" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              Failed to generate QR code.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
