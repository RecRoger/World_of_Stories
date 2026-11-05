import { createBrowserRouter, Navigate } from 'react-router';
import { GuestOnly, RequireAuth, RequireWriter } from '@/features/auth/guards';
import { WriterLayout, type WriterRouteHandle } from '@/features/writer/writer-layout';
import { LandingPage } from '@/pages/landing-page';
import { AccessPage } from '@/pages/access-page';
import { ChoosePage } from '@/pages/choose-page';
import { WriterJoinPage } from '@/pages/writer-join-page';
import { CitiesPage } from '@/pages/cities-page';
import { CityPlacesPage } from '@/pages/city-places-page';
import { ComingSoonPage } from '@/pages/coming-soon-page';
import { PlaceEventsPage } from '@/pages/place-events-page';
import { NpcChaptersPage } from '@/pages/npc-chapters-page';
import { NotFoundPage } from '@/pages/not-found-page';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    element: <GuestOnly />,
    children: [{ path: '/access', element: <AccessPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/home', element: <ChoosePage /> },
      { path: '/read', element: <ComingSoonPage title="Leer" /> },
      { path: '/write/join', element: <WriterJoinPage /> },
      {
        path: '/write',
        element: <RequireWriter />,
        children: [
          {
            element: <WriterLayout />,
            children: [
              { index: true, element: <Navigate to="cities" replace /> },
              { path: 'cities', element: <CitiesPage /> },
              {
                path: 'cities/:cityId/places',
                element: <CityPlacesPage />,
                handle: { back: () => ({ to: '/write/cities', label: 'Volver a Ciudades' }) } satisfies WriterRouteHandle,
              },
              {
                path: 'cities/:cityId/places/:placeId/events',
                element: <PlaceEventsPage />,
                handle: {
                  back: ({ cityId }) => ({ to: `/write/cities/${cityId}/places`, label: 'Volver a Lugares' }),
                } satisfies WriterRouteHandle,
              },
              {
                path: 'cities/:cityId/places/:placeId/npcs/:npcId/chapters',
                element: <NpcChaptersPage />,
                handle: {
                  back: ({ cityId, placeId }) => ({ to: `/write/cities/${cityId}/places/${placeId}/events`, label: 'Volver a Eventos' }),
                } satisfies WriterRouteHandle,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
