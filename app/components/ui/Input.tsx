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
    const baseClasses = "px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500";
    const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300";
    const widthClass = fullWidth ? "w-full" : "";
    
    const inputClasses = [baseClasses, errorClasses, widthClass, className].filter(Boolean).join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
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
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input; 