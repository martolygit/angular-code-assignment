import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'voting',
    loadComponent: () => import('./voting-list/voting-list.component').then(c => c.VotingListComponent)
  },
  {
    path: '**',
    redirectTo: 'voting'
  }
];
