import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "secondary" | "teal" | "blue" | "gray";
type SpinnerSpeed = "slow" | "normal" | "fast";

interface ThemeSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  trackColor?: string;
  useGradient?: boolean;
  speed?: SpinnerSpeed;
  className?: string;
}

export function CircleSpinner({
  size = "xl",
  variant = "primary",
  color,
  trackColor,
  useGradient = false,
  speed = "normal",
  className,
}: ThemeSpinnerProps) {
  const sizeMap: Record<SpinnerSize, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const variantColorMap: Record<SpinnerVariant, string> = {
    primary: "text-teal-500 dark:text-teal-400",
    secondary: "text-blue-500 dark:text-blue-400",
    teal: "text-teal-500 dark:text-teal-400",
    blue: "text-blue-500 dark:text-blue-400",
    gray: "text-gray-600 dark:text-gray-400",
  };

  const speedMap: Record<SpinnerSpeed, string> = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  const pixelSize = sizeMap[size];
  const variantClass = color ? "" : variantColorMap[variant];
  const speedClass = speedMap[speed];
  const gradientId = `spinner-gradient-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(variantClass, speedClass, className)}
      style={color ? { color } : undefined}
      role="status"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
      )}

      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={trackColor || "currentColor"}
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill={useGradient ? `url(#${gradientId})` : "currentColor"}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
