import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = "primary", 
    size = "md", 
    fullWidth = false,
    className = "",
    children,
    ...props 
  }, ref) => {
    const baseClasses = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClass,
      className,
    ].filter(Boolean).join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button; 