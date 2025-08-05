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
    const baseClasses = "px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 resize-none";
    const errorClasses = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300";
    const widthClass = fullWidth ? "w-full" : "";
    
    const textareaClasses = [baseClasses, errorClasses, widthClass, className].filter(Boolean).join(" ");

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
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={textareaClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea; 