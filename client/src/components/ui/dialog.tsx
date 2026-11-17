import type { ComponentProps } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';
import { IconButton } from './icon-button';
import './dialog.scss';

// Diálogo modal (Radix): atrapa el foco, cierra con Escape y devuelve el foco al disparador
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog__overlay" />
      <div className="dialog__viewport">
        <DialogPrimitive.Content
          className={cn('dialog__content', className)}
          {...props}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <IconButton label="Cerrar" className="dialog__close">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('dialog__title', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('dialog__description', className)} {...props} />;
}
