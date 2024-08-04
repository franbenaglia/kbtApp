import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/bltemperature',
    loadComponent: () => import('./bltemperature/bltemperature.page').then(m => m.BltemperaturePage)
  },
  {
    path: 'folder/test',
    loadComponent: () => import('./test/test.page').then(m => m.TestPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },

];
