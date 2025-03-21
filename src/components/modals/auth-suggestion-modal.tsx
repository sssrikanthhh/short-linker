"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type AuthSuggestionModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shortUrl: string;
};

export default function AuthSuggestionModal({
  isOpen,
  onOpenChange,
  shortUrl,
}: AuthSuggestionModalProps) {
  const router = useRouter();

  const handleRegister = () => {
    onOpenChange(false);
    router.push("/register");
  };
  const handleLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>URL shortend successfully.</DialogTitle>
          <DialogDescription>
            To save, track and view the statistics of your shortened URLs,
            please register or login to Short Linker.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="bg-muted rounded-md p-4">
            <p className="text-sm font-medium">Your shortened URL:</p>
            <p className="mt-1 font-mono text-sm break-all">{shortUrl}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Create an account to:</h4>
            <ul className="ml-4 list-disc text-sm font-medium">
              <li>Save all your shortened URLs.</li>
              <li>View your all URLs in one place.</li>
              <li>Track link analytics.</li>
              <li>Customize your short links.</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleRegister}>
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
