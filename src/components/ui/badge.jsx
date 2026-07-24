import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent-s)] text-[var(--accent)]',
        secondary: 'bg-[var(--surface2)] text-[var(--text2)]',
        success: 'bg-[var(--success-s)] text-[var(--success)]',
        destructive: 'bg-red-100 text-[var(--danger)]',
        teal: 'bg-[var(--teal-s)] text-[var(--teal)]',
        amber: 'bg-[var(--amber-s)] text-[var(--amber)]',
        outline: 'border border-[var(--border)] text-[var(--text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
