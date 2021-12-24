import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalfModalPageRoutingModule } from './half-modal-routing.module';

import { HalfModalPage } from './half-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HalfModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [HalfModalPage]
})
export class HalfModalPageModule {}
