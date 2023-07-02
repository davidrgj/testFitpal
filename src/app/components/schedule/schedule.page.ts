import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Class } from 'src/app/models/class';
import { Schedule } from 'src/app/models/schedule';
import { ClassService } from 'src/app/services/tabs/class.service';
import { ScheduleService } from 'src/app/services/tabs/schedule.service';

import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule.page.html',
  styleUrls: ['schedule.page.scss']
})
export class SchedulePage implements OnInit {

  showHeaderTitle: boolean = false;
  classes: Class[] = [];
  now: Date = new Date();
  scheduleForm: FormGroup;
  schedule!: Schedule;
  schedules: Schedule[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private _utilsService: UtilsService,
    private _classService: ClassService,
    private _scheduleService: ScheduleService
  ) {
    this.scheduleForm = this.formBuilder.group({
      id: [''],
      class_id: ['', Validators.required],
      date: [this.now.toISOString(), Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForm();

    this.loadSchedules();
    this.loadClasses();

    // Refresh data when item class is created, updated or deleted
    this._classService.refreshClasses.subscribe(() => this.loadClasses());
    this._scheduleService.refreshSchedules.subscribe(() => this.loadSchedules());
  }

  initializeForm(): void {
    this.scheduleForm = this.formBuilder.group({
      id: [''],
      class_id: ['', Validators.required],
      date: [this.now.toISOString(), Validators.required],
    });
  }

  loadSchedules(): void {
    this.schedules = this._scheduleService.getAll();
  }

  loadClasses(): void {
    this.classes = this._classService.getAll();
  }

  getClassName(classId: number | string): string {
    const classObj = this.classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Esta clase se ha eliminado';
  }

  formatDate(date: string): string {
    const scheduleDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return scheduleDate.toLocaleDateString('es-ES', options);
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) return;

    const scheduleData: Schedule = this.scheduleForm.value;

    if (scheduleData.id) {
      if (this.isScheduleConflict(scheduleData)) {
        this.presentAlertSameSchedule();
        return;
      }
      this._scheduleService.update(this.schedule.id, scheduleData);
    } else {
      if (this.isScheduleConflict(scheduleData)) {
        this.presentAlertSameSchedule();
        return;
      }
      this._scheduleService.create(scheduleData);
    }

    this._scheduleService.refreshSchedules.emit(scheduleData);

    this.initializeForm();
  }


  isScheduleConflict(newSchedule: Schedule): boolean {

    const schedules = this._scheduleService.getAll();

    for (const schedule of schedules) {
      if (
        schedule.id !== newSchedule.id &&
        schedule.class_id === newSchedule.class_id &&
        this.isSameDay(schedule.date, newSchedule.date) &&
        this.isSameHour(schedule.date, newSchedule.date)
      ) {
        return true;
      }
    }
    return false;
  }

  isSameDay(date1: string, date2: string): boolean {
    const day1 = new Date(date1).getDate();
    const day2 = new Date(date2).getDate();
    return day1 === day2;
  }

  isSameHour(date1: string, date2: string): boolean {
    const hour1 = date1.split('T')[1].split(':')[0];
    const hour2 = date2.split('T')[1].split(':')[0];
    return hour1 === hour2;
  }

  formatDateMinMaxCalendar(dateString: Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  async presentAlertSameSchedule() {
    const alert = await this.alertController.create({
      subHeader: 'Ya se creo esta clase a esta misma hora, por favor intenta con otro horario',
      buttons: ['De acuerdo'],
      mode: 'ios'
    });

    await alert.present();
  }


  editSchedule(schedule: Schedule): void {
    this.scheduleForm.patchValue({
      id: schedule.id,
      class_id: schedule.class_id,
      date: schedule.date
    });
    this.schedule = schedule;
  }

  async deleteSchedule(scheduleId: number | string) {

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
      this._scheduleService.delete(scheduleId);
      this.loadSchedules();
    }
  }

  onScroll(event: any) {
    this.showHeaderTitle = this._utilsService.showHeaderTitle;

    const position = event.detail.scrollTop;
    this._utilsService.showTitlePage(position);
  }

}
