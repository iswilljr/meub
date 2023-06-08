import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cx } from '@/utils/cx'

const buttonVariants = cva(
  'flex items-center justify-center rounded-md ring-1 px-4 py-2 font-medium transition-all duration-200 outline-none ease-in-out focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-300 dark:bg-neutral-800 dark:text-white hover:bg-neutral-300/30 dark:hover:bg-neutral-800/50 ring-neutral-400 dark:ring-neutral-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, icon, variant, ...props }, ref) => {
    return (
      <button ref={ref} className={cx(buttonVariants({ variant, className }))} {...props}>
        {icon && <span className={cx(children && 'mr-2')}>{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
