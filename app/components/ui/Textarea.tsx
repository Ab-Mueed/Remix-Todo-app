import { Textarea as MantineTextarea, type TextareaProps as MantineTextareaProps } from "@mantine/core";
import { forwardRef } from "react";

interface TextareaProps extends Omit<MantineTextareaProps, 'size'> {
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    fullWidth = true,
    rows = 4,
    ...props 
  }, ref) => {
    return (
      <MantineTextarea
        ref={ref}
        radius="md"
        size="md"
        rows={rows}
        resize="none"
        w={fullWidth ? "100%" : undefined}
        styles={{
          input: {
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid var(--mantine-color-gray-4)',
            '&:focus': {
              borderColor: 'var(--mantine-color-blue-6)',
              backgroundColor: 'white',
              color: 'black'
            },
            '&::placeholder': {
              color: 'var(--mantine-color-gray-5)'
            }
          },
          label: {
            color: 'black',
            fontWeight: 500
          }
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea; 