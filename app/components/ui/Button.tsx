import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends Omit<MantineButtonProps, 'variant' | 'size'>, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    children,
    ...props
  }, ref) => {
    const getVariantProps = () => {
      switch (variant) {
        case "primary":
          return {
            variant: "filled" as const,
            color: "blue",
            styles: {
              root: {
                color: 'white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }
            }
          };
        case "secondary":
          return {
            variant: "filled" as const,
            color: "gray",
            styles: {
              root: {
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  color: 'black',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }
            }
          };
        case "danger":
          return {
            variant: "filled" as const,
            color: "red",
            styles: {
              root: {
                color: 'white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }
            }
          };
        case "success":
          return {
            variant: "filled" as const,
            color: "teal",
            styles: {
              root: {
                color: 'white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }
            }
          };
        default:
          return {
            variant: "filled" as const,
            color: "blue",
            styles: {
              root: {
                color: 'white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }
            }
          };
      }
    };

    const getSizeProps = () => {
      switch (size) {
        case "sm":
          return { size: "sm" as const, h: 32 };
        case "md":
          return { size: "md" as const, h: 40 };
        case "lg":
          return { size: "lg" as const, h: 48 };
        default:
          return { size: "md" as const, h: 40 };
      }
    };

    return (
      <MantineButton
        ref={ref}
        fullWidth={fullWidth}
        radius="sm"
        {...getVariantProps()}
        {...getSizeProps()}
        {...props}
      >
        {children}
      </MantineButton>
    );
  }
);

Button.displayName = "Button";

export default Button; 