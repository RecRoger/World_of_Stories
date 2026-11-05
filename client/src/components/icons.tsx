import type { ComponentProps } from 'react';

// Iconos de trazo del diseño. Heredan el color del texto (`currentColor`) y son decorativos.
type IconProps = ComponentProps<'svg'>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" {...stroke} {...props}>
      <path d="M1 6h17M13 1l5 5-5 5" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" {...stroke} {...props}>
      <path d="M24 12c-4-3-10-4-17-3v26c7-1 13 0 17 3 4-3 10-4 17-3V9c-7-1-13 0-17 3z" />
      <path d="M24 12v26" />
    </svg>
  );
}

export function QuillIcon(props: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" {...stroke} {...props}>
      <path d="M40 6C26 8 16 18 13 32l-3 10 10-3c14-3 22-14 20-33z" />
      <path d="M13 32c4-8 10-15 20-20" />
    </svg>
  );
}

export function PlusCircleIcon(props: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" {...stroke} {...props}>
      <circle cx="24" cy="24" r="20" />
      <path d="M24 14v20M14 24h20" />
    </svg>
  );
}

// Iconos de acción (24×24), para botones de solo icono con `aria-label`
export function PencilIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}

export function UnpublishIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

export function PublishIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 15v4h16v-4" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" {...stroke} {...props}>
      <path d="M19 6H2M7 1L2 6l5 5" />
    </svg>
  );
}
