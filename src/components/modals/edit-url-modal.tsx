"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { UpdateUrlFormData, updateUrlSchemaWithoutId } from "@/lib/schemas";
import { updateUrl } from "@/actions/url/update-url";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

type EditUrlModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: string;
  shortCode: string;
  onSuccess: (newShortCode: string) => void;
};

export default function EditUrlModal({
  isOpen,
  onOpenChange,
  urlId,
  shortCode: initialShortCode,
  onSuccess,
}: EditUrlModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

  const form = useForm<UpdateUrlFormData>({
    resolver: zodResolver(updateUrlSchemaWithoutId),
    defaultValues: {
      customCode: initialShortCode,
    },
  });

  const onSubmit = async (data: UpdateUrlFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", urlId);
      formData.append("customCode", data.customCode);

      const response = await updateUrl(formData);
      if (response.success && response.data) {
        toast("URL updated successfully.", {
          description: "Your custom code has been updated.",
        });
        onSuccess(response.data.shortUrl.split("/").pop()!);
        onOpenChange(false);
      } else {
        toast.error(response.error || "Failed to update URL.");
      }
    } catch (error) {
      toast.error("Failed to update URL.", {
        description: "The url you are trying to update is failed, try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    form.reset({
      customCode: initialShortCode,
    });
  }, [initialShortCode]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Short Url(code):</DialogTitle>
          <DialogDescription>
            Customize the short code for your URL. The short code must be at
            least 3 characters long and can contain letters, numbers,
            underscores, and hyphens.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Code</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2 text-base">
                        {baseUrl}/sl/
                      </span>
                      <Input
                        placeholder="Enter your custom code here..."
                        type="text"
                        {...field}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="size-4 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>
                    <span>Save changes</span>
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
