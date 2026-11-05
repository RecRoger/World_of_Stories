import type { ComponentProps } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';
import { IconButton } from './icon-button';

// Diálogo modal (Radix): atrapa el foco, cierra con Escape y devuelve el foco al disparador
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/55" />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-5">
        <DialogPrimitive.Content
          className={cn(
            'pointer-events-auto relative box-border flex max-h-[calc(100dvh-40px)] w-[min(100%,640px)] flex-col overflow-y-auto bg-paper shadow-paper',
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <IconButton label="Cerrar" className="absolute top-2.5 right-2.5">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('font-display text-[44px] leading-none font-semibold', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('text-xl leading-normal text-pretty text-ink-soft', className)} {...props} />;
}
