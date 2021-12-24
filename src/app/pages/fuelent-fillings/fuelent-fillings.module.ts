import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuelentFillingsPageRoutingModule } from './fuelent-fillings-routing.module';

import { FuelentFillingsPage } from './fuelent-fillings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuelentFillingsPageRoutingModule
  ],
  declarations: [FuelentFillingsPage]
})
export class FuelentFillingsPageModule {}
