import { memo } from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = memo(({ className = "", size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]} ${className}`}></div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner }; 