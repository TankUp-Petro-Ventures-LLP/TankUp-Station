import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuelentPageRoutingModule } from './fuelent-routing.module';

import { FuelentPage } from './fuelent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuelentPageRoutingModule
  ],
  declarations: [FuelentPage]
})
export class FuelentPageModule {}
