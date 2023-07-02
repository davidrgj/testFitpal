import { Component, OnInit } from '@angular/core';

import { ClassService } from 'src/app/services/tabs/class.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Class } from 'src/app/models/class';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ClassFormPage } from './class-form/class-form.page';

@Component({
  selector: 'app-class',
  templateUrl: 'class.page.html',
  styleUrls: ['class.page.scss']
})
export class ClassPage implements OnInit {

  showHeaderTitle: boolean = false;
  classes: Class[] = [];

  constructor(
    private _classService: ClassService,
    private _utilsService: UtilsService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) {

  }

  ngOnInit(): void {
    this.loadClasses();

    // Refresh data when item class is created, updated or deleted
    this._classService.refreshClasses.subscribe(() => this.loadClasses());
  }

  loadClasses(): void {
    this.classes = this._classService.getAll();
  }

  async createClass() {
    const modal = await this.modalController.create({
      component: ClassFormPage
    });

    await modal.present(); 
  }

  async editClass(classData: Class) {
    this._classService.setClass(classData);
    this._classService.action = 'update';


    const modal = await this.modalController.create({
      component: ClassFormPage,
      mode: 'ios'
    });

    await modal.present();
  }

  async deleteClass(classId: number | string) {

    const actionSheet = await this.actionSheetController.create({
      subHeader: '¿Estás seguro de eliminar este registro?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive'
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      mode: 'ios'
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

    if (role === 'destructive') {
      this._classService.delete(classId);
      this._classService.refreshClasses.emit(classId);
      this.loadClasses();
    }
  }

  onScroll(event: any) {
    this.showHeaderTitle = this._utilsService.showHeaderTitle;

    const position = event.detail.scrollTop;
    this._utilsService.showTitlePage(position);
  }

}
