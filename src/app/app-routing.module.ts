import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    // loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'list-view',
    loadChildren: () => import('./pages/list-view/list-view.module').then( m => m.ListViewPageModule)
  },
  {
    path: 'list-view/:id',
    loadChildren: () => import('./pages/list-view/list-view.module').then( m => m.ListViewPageModule)
  },
  {
    path: 'future-list',
    loadChildren: () => import('./pages/future-list/future-list.module').then( m => m.FutureListPageModule)
  },
  {
    path: 'add-item',
    loadChildren: () => import('./pages/add-item/add-item.module').then( m => m.AddItemPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
