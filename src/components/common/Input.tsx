// src/components/common/Input.tsx - FIXED VERSION
import { forwardRef, InputHTMLAttributes } from "react";
import { LucideIcon, AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
  variant?: "default" | "ghost";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      fullWidth = true,
      variant = "default",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputClasses =
      "block px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const variantClasses = {
      default:
        "bg-white/5 border border-white/10 rounded-xl hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      ghost: "bg-transparent border-none focus:bg-white/5 rounded-lg",
    };

    const errorClasses = error
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
      : "";

    const widthClasses = fullWidth ? "w-full" : "";

    const inputClasses = [
      baseInputClasses,
      variantClasses[variant],
      errorClasses,
      widthClasses,
      LeftIcon ? "pl-12" : "",
      RightIcon ? "pr-12" : "",
      className,
    ].join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <LeftIcon className="w-4 h-4 text-gray-400" />
            </div>
          )}

          <input ref={ref} id={inputId} className={inputClasses} {...props} />

          {(RightIcon || error) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {error ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : RightIcon ? (
                <button
                  type="button"
                  onClick={onRightIconClick}
                  className="text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  <RightIcon className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          )}
        </div>

        {(error || helper) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            {!error && helper && (
              <p className="text-sm text-gray-400">{helper}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
