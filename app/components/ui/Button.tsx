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
    const baseClasses = "font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";
    
    const variantClasses = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 shadow-sm hover:shadow-md",
      secondary: "bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500 border border-slate-200 shadow-sm hover:shadow-md",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md",
      success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm hover:shadow-md",
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-sm min-h-[32px]",
      md: "px-6 py-2.5 text-sm min-h-[40px]",
      lg: "px-8 py-3 text-base min-h-[48px]",
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