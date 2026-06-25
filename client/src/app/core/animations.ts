import { trigger, transition, style, animate } from '@angular/animations';

// Animación básica de fundido (Fade In)
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

// Animación de fundido con desplazamiento lateral (Fade In Right)
export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(30px)' }),
    animate('350ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('250ms ease-out', style({ opacity: 0, transform: 'translateX(30px)' }))
  ])
]);