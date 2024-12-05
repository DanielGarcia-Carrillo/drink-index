'use client';

import { forwardRef, ButtonHTMLAttributes, ForwardedRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonStyles } from './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
  className?: string;
}

function ButtonComponent({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  asChild = false,
  className,
  ...props
}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp
      className={buttonStyles({ variant, size, fullWidth })}
      ref={ref}
      {...props}
    />
  );
}

ButtonComponent.displayName = 'Button';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonComponent);

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize }; 