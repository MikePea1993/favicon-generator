// src/components/common/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      loading = false,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 focus:ring-blue-500/50 disabled:from-gray-600 disabled:to-gray-600 disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100",
      secondary:
        "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white focus:ring-white/20 disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-500",
      ghost:
        "text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/20 disabled:text-gray-500",
      danger:
        "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 focus:ring-red-500/50 disabled:from-gray-600 disabled:to-gray-600 disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100",
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const isDisabled = disabled || loading;

    const buttonClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClasses,
      className,
    ].join(" ");

    const iconElement = Icon && <Icon className={iconSizeClasses[size]} />;

    const loadingSpinner = loading && (
      <div
        className={`border-2 border-current border-t-transparent rounded-full animate-spin ${iconSizeClasses[size]}`}
      />
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && loadingSpinner}
        {!loading && Icon && iconPosition === "left" && iconElement}
        {children}
        {!loading && Icon && iconPosition === "right" && iconElement}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
