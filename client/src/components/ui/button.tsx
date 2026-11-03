import type { ComponentProps } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-3 rounded-[2px] font-serif tracking-[0.04em] transition-[transform,background-color] duration-200 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        // Tinta sobre pergamino, con el canto que se levanta al pasar el ratón
        primary: 'bg-ink text-parchment shadow-press hover:-translate-y-0.5 hover:bg-black',
        ghost: 'bg-transparent text-ink hover:bg-ink/5',
      },
      size: {
        md: 'min-h-12 px-6 text-[19px]',
        lg: 'min-h-14 px-9 text-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  },
);

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
