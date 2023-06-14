import * as React from 'react'
import { cx } from '@/utils/cx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cx(
        'flex h-10 w-full rounded-md border border-none bg-transparent px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
