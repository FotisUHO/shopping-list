import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutureListPage } from './future-list.page';

const routes: Routes = [
  {
    path: '',
    component: FutureListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FutureListPageRoutingModule {}
