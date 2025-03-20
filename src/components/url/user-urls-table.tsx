"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { Url } from "@/lib/types";
import {
  Copy,
  Edit,
  ExternalLink,
  QrCode,
  Trash2Icon,
  Loader,
} from "lucide-react";
import { Button } from "../ui/button";
import { deleteUrl } from "@/actions/url/delete-url";
import QrCodeModal from "../modals/qr-code-modal";
import EditUrlModal from "../modals/edit-url-modal";

type UserUrlsTableProps = {
  urls: Url[];
};

export default function UserUrlsTable({ urls }: UserUrlsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [localUrls, setLocalUrls] = useState(urls);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeShortCode, setQrCodeShortCode] = useState("");
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<Pick<
    Url,
    "id" | "shortCode"
  > | null>(null);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("Failed to copy.");
    }
  };

  const handleDelete = async (urlId: string) => {
    setIsDeleting(urlId);
    try {
      const response = await deleteUrl(urlId);
      if (response.success) {
        setLocalUrls((prevUrls) => prevUrls.filter((url) => url.id !== urlId));
        toast.success("URL deleted successfully.");
      } else {
        toast.error(response.error || "Failed to delete URL.");
      }
    } catch (error) {
      toast.error("Failed to delete URL.");
    } finally {
      setIsDeleting(null);
    }
  };

  const showQrCode = (shortCode: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const shortUrl = `${BASE_URL}/sl/${shortCode}`;

    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  const handleEdit = (id: string, shortCode: string) => {
    setUrlToEdit({ id, shortCode });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (newShortCode: string) => {
    if (!urlToEdit) return;
    //update the local urls state
    setLocalUrls((prevUrls) =>
      prevUrls.map((url) =>
        url.id === urlToEdit.id ? { ...url, shortCode: newShortCode } : url,
      ),
    );
  };

  if (localUrls.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          You don&apos;t have any short links yet. create one now to get
          started.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="truncate border-b">
              <th className="px-4 py-3 text-left font-medium">Original URL</th>
              <th className="px-4 py-3 text-left font-medium">Short URL</th>
              <th className="hidden px-4 py-3 text-left font-medium md:block">
                Clicks
              </th>
              <th className="px-4 py-3 text-left font-medium">Created At</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {localUrls.map((url) => {
              const BASE_URL =
                process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
              const shortUrl = `${BASE_URL}/sl/${url.shortCode}`;
              return (
                <tr key={url.id} className="hover: bg-muted/50 border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div
                        className="max-w-sm truncate"
                        title={url.originalUrl}
                      >
                        <span className="text-xs font-medium">
                          {url.originalUrl}
                        </span>
                      </div>
                      <Link
                        href={url.originalUrl}
                        target="_blank"
                        className="text-muted-foreground hover:text-foreground ml-2"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="truncate" title={shortUrl}>
                        <span className="text-xs font-medium">{shortUrl}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy to clipboard"
                        onClick={() => copyToClipboard(shortUrl)}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 md:block">
                    {url.clicks}
                  </td>
                  <td className="text-muted-foreground truncate px-4 py-3 text-sm">
                    {formatDistanceToNow(new Date(url.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary size-8"
                        title="Generate QR code"
                        onClick={() => showQrCode(url.shortCode)}
                      >
                        <QrCode className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:text-primary size-8"
                        title="Edit"
                        onClick={() => handleEdit(url.id, url.shortCode)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive size-8"
                        title="Delete"
                        onClick={() => handleDelete(url.id)}
                        disabled={isDeleting === url.id}
                      >
                        {isDeleting === url.id ? (
                          <Loader className="size-4 animate-spin" />
                        ) : (
                          <Trash2Icon className="size-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <QrCodeModal
        isOpen={isQrCodeModalOpen}
        onOpenChange={setIsQrCodeModalOpen}
        url={qrCodeUrl}
        shortCode={qrCodeShortCode}
      />

      {urlToEdit && (
        <EditUrlModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          urlId={urlToEdit.id}
          shortCode={urlToEdit.shortCode}
          onSuccess={handleEditSuccess}
        />
      )}
    </section>
  );
}
