import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ListViewPage } from './list-view.page';

const routes: Routes = [
  {
    path: '',
    component: ListViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ListViewPageRoutingModule {}
