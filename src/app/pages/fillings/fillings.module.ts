import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FillingsPageRoutingModule } from './fillings-routing.module';

import { FillingsPage } from './fillings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FillingsPageRoutingModule
  ],
  declarations: [FillingsPage]
})
export class FillingsPageModule {}
