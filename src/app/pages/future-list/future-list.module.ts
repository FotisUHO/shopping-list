import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FutureListPageRoutingModule } from './future-list-routing.module';

import { FutureListPage } from './future-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FutureListPageRoutingModule
  ],
  declarations: [FutureListPage]
})
export class FutureListPageModule {}
