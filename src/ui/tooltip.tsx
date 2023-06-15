'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cx } from '@/utils/cx'

interface TooltipProps extends TooltipPrimitive.TooltipProps {
  content: string
}

const TooltipRoot = TooltipPrimitive.Root
const TooltipProvider = TooltipPrimitive.Provider
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cx(
      'z-50 overflow-hidden rounded-md border border-none bg-white px-3 py-1.5 text-sm text-gray-600 shadow-md outline-none ring-1 ring-neutral-300 animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 dark:bg-neutral-800 dark:text-gray-200 dark:ring-neutral-600',
      className
    )}
    {...props}
  />
))

const Tooltip = ({ content, children, ...props }: TooltipProps) => (
  <TooltipProvider>
    <TooltipRoot {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className='text-sm'>{content}</p>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
)

Tooltip.displayName = TooltipRoot.displayName
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }
