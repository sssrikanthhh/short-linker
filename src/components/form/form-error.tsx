import { CircleAlert } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export default function FormError({ message }: FormSuccessProps) {
  if (!message) return null;
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-red-500/30 p-2 text-red-500">
      <CircleAlert className="size-4" />
      <p>{message}</p>
    </div>
  );
}
