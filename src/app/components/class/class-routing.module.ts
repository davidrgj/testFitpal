import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassPage } from './class.page';

const routes: Routes = [
  {
    path: '',
    component: ClassPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassPageRoutingModule {}
