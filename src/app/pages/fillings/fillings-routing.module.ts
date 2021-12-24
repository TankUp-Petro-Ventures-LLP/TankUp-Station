import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillingsPage } from './fillings.page';

const routes: Routes = [
  {
    path: '',
    component: FillingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillingsPageRoutingModule {}
