// app/components/ui/button.tsx
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text or element to display inside the button */
  children: React.ReactNode;
}

/**
 * Simple reusable button component.
 * Uses Tailwind classes for a consistent look across the app.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
