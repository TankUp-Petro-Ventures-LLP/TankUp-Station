import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuelentPage } from './fuelent.page';

const routes: Routes = [
  {
    path: '',
    component: FuelentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelentPageRoutingModule {}
