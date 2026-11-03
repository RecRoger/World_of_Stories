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
