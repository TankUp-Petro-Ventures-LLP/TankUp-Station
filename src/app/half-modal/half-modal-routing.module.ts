import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HalfModalPage } from './half-modal.page';

const routes: Routes = [
  {
    path: '',
    component: HalfModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalfModalPageRoutingModule {}
