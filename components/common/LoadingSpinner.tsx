import { useI18n } from "@/lib/i18n/context";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message, size = "md" }: LoadingSpinnerProps) {
  const { t } = useI18n();
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}
        />
        <p className="mt-4 text-gray-600">{message || t.common.loading}</p>
      </div>
    </div>
  );
}






