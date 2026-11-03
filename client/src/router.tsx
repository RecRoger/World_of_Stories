import { createBrowserRouter } from 'react-router';
import { GuestOnly, RequireAuth } from '@/features/auth/guards';
import { LandingPage } from '@/pages/landing-page';
import { AccessPage } from '@/pages/access-page';
import { ChoosePage } from '@/pages/choose-page';
import { ComingSoonPage } from '@/pages/coming-soon-page';
import { NotFoundPage } from '@/pages/not-found-page';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    element: <GuestOnly />,
    children: [{ path: '/acceso', element: <AccessPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/inicio', element: <ChoosePage /> },
      { path: '/leer', element: <ComingSoonPage title="Leer" /> },
      { path: '/escribir', element: <ComingSoonPage title="Escribir" /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
