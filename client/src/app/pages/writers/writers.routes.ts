import { Routes } from '@angular/router';

export const WRITERS_ROUTES: Routes = [
    {
        path: '', pathMatch: 'full',
        loadComponent: () => import('./components/writers-home/writers-home.component').then(c => c.WritersHomeComponent)
    },
    {
        path: 'world',
        loadComponent: () => import('./components/world-stories/world-stories.component').then(c => c.WorldStoriesComponent)
    },

];
