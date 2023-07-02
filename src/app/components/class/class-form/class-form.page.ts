import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';

import { ClassService } from 'src/app/services/tabs/class.service';
import { Class } from 'src/app/models/class';

@Component({
  selector: 'app-class-form',
  templateUrl: 'class-form.page.html',
  styleUrls: ['class-form.page.scss']
})
export class ClassFormPage implements OnInit, OnDestroy {

  classForm: FormGroup;
  class!: Class;


  constructor(
    private formBuilder: FormBuilder,
    private _classService: ClassService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) {
    this.classForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();

    if (this._classService.action == 'update') {
      this.class = this._classService.getClass();
      this.classForm.patchValue(this.class);
    }
  }

  initializeForm(): void {
    this.classForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  resetForm(): void {
    this.classForm.reset();
  }

  dismissModal() {
    if (!this.classForm.pristine) {
      this.canDismiss();
    } else {
      this.modalController.dismiss({
        'dismissed': true
      });
    }
  }


  async canDismiss() {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Está seguro de descartar los cambios?',
      buttons: [
        {
          text: 'Descartar',
          role: 'destructive'
        },
        {
          text: 'Seguir editando',
          role: 'cancel'
        }
      ],
      mode: 'ios'
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

    if (role === 'destructive') {
      this.modalController.dismiss({
        'dismissed': true
      });
    }

    return false;
  }

  onSubmit(): void {
    if (this.classForm.invalid) return;

    const classData: Class = this.classForm.value;
    if (classData.id) {
      this._classService.update(classData);
    } else {
      this._classService.create(classData);
    }

    this._classService.refreshClasses.emit(classData);

    this.resetForm();
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnDestroy(): void {
    this._classService.action = '';
  }
}
