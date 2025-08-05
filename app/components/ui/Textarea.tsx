import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label,
    error,
    fullWidth = true,
    className = "",
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const baseClasses = "px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm resize-none";
    const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-200";
    const widthClass = fullWidth ? "w-full" : "";
    
    const textareaClasses = [baseClasses, errorClasses, widthClass, className].filter(Boolean).join(" ");

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
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={textareaClasses}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea; 