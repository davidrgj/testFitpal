import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassPage } from './class.page';

import { ClassPageRoutingModule } from './class-routing.module';
import { ClassFormPage } from './class-form/class-form.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClassPageRoutingModule
  ],
  declarations: [ClassPage, ClassFormPage]
})
export class ClassPageModule {}
