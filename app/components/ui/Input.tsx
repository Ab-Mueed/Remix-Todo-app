import { TextInput, type TextInputProps } from "@mantine/core";
import { forwardRef } from "react";

interface InputProps extends Omit<TextInputProps, 'size'> {
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    fullWidth = true,
    ...props 
  }, ref) => {
    return (
      <TextInput
        ref={ref}
        radius="md"
        size="md"
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

Input.displayName = "Input";

export default Input; 