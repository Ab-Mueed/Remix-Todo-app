import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    fullWidth = true,
    className = "",
    id,
    ...props 
  }, ref) => {
    const baseClasses = "px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm";
    const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-200";
    const widthClass = fullWidth ? "w-full" : "";
    
    const inputClasses = [baseClasses, errorClasses, widthClass, className].filter(Boolean).join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input; 