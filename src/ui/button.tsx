/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import * as React from 'react'
import { TbLoader } from 'react-icons/tb'
import { cx } from '@/utils/cx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, icon, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cx(
          'flex items-center justify-center rounded-md bg-neutral-300 px-4 py-2 font-medium outline-none ring-1 ring-neutral-400 transition-all duration-200 ease-in-out hover:bg-neutral-300/30 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700 dark:hover:bg-neutral-800/50',
          className
        )}
        {...props}
      >
        {(loading || icon) && (
          <span className={cx(children && 'mr-2')}>{loading ? <TbLoader className='animate-spin' /> : icon}</span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
