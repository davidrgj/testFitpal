import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class';
import { Schedule } from 'src/app/models/schedule';
import { ClassService } from 'src/app/services/tabs/class.service';
import { ScheduleService } from 'src/app/services/tabs/schedule.service';
import { UtilsService } from 'src/app/services/utils.service';

export interface ClassWithSchedule extends Class {
  schedule?: Schedule | null;
}

@Component({
  selector: 'app-today',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss']
})
export class TodayPage implements OnInit {

  showHeaderTitle: boolean = false;
  classes: ClassWithSchedule[] = [];
  schedules: Schedule[] = [];
  todayClasses: ClassWithSchedule[] = [];
  selectedClasses: ClassWithSchedule[] = [];
  upcomingDates: Date[] = [];
  selectedDate?: Date;
  nextDays?: Date;
  now: Date = new Date();

  constructor(
    private _utilsService: UtilsService,
    private _classService: ClassService,
    private _scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.loadSchedules();
    this.loadClasses();

    // Refresh data when item class is created, updated or deleted
    this._classService.refreshClasses.subscribe(() => this.loadClasses());
    this._scheduleService.refreshSchedules.subscribe(() => {
      this.loadSchedules();
      this.loadTodayClasses();
      this.loadUpcomingDates();
      this.showClassesBySelectedDate();
    });

    this.loadTodayClasses();
    this.loadUpcomingDates();
  }

  loadSchedules(): void {
    this.schedules = this._scheduleService.getAll();
  }

  loadClasses(): void {
    this.classes = this._classService.getAll().map((classObj: Class) => {
      return { ...classObj, schedule: null };
    });
  }

  loadTodayClasses() {
    const today = new Date();
    this.todayClasses = this.getClassesByDate(today);
  }

  isClassExecuted(classObj: any): boolean {
    const classDate = classObj?.schedule?.date;
    if (classDate) {
      const parsedDate = new Date(classDate);
      return parsedDate < this.now;
    }
    return false;
  }

  loadUpcomingDates() {
    this.upcomingDates = [];

    for (let i = 0; i < 3; i++) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i + 1);
      this.upcomingDates.push(nextDate);
    }

    // Seleccionar automáticamente el próximo día
    if (this.upcomingDates.length > 0) {
      this.nextDays = this.upcomingDates[0];
    }
  }

  getClassesByDate(date: Date): ClassWithSchedule[] {
    if (!date)
      return [];

    const todayString = date instanceof Date ? date.toDateString() : '';
    return this.schedules
      .filter((schedule) => this.isSameDay(schedule.date, todayString))
      .map((schedule) => {
        const classObj = this.getClassById(schedule.class_id);
        return { ...classObj, schedule };
      });
  }

  isSameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  getClassById(classId: number | string): ClassWithSchedule | any {
    return this.classes.find((classI) => classI.id === classId);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1);
    const day = this.padNumber(date.getDate());
    return `${year}-${month}-${day}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  showClassesBySelectedDate() {
    if (!this.selectedDate) return;

    const selectedDate = new Date(this.selectedDate);
    const classes = this.getClassesByDate(selectedDate);

    // Filtrar las clases que tienen programación para la fecha seleccionada
    this.selectedClasses = classes.filter((classObj: ClassWithSchedule) => {
      const schedule = this.getScheduleByClassAndDate(classObj.id, selectedDate);
      return schedule !== undefined;
    });

    // Ordenar las clases por hora de inicio
    this.selectedClasses.sort((a: ClassWithSchedule, b: ClassWithSchedule) => {
      const scheduleA = a.schedule;
      const scheduleB = b.schedule;
      if (scheduleA && scheduleB) {
        return new Date(scheduleA.date).getTime() - new Date(scheduleB.date).getTime();
      }
      return 0;
    });
  }

  getScheduleByClassAndDate(classId: number | string, date: Date): Schedule[] {
    const dateString = this.formatDate(date);
    return this.schedules.filter((schedule) => schedule.class_id === classId && schedule.date === dateString);
  }

  onScroll(event: any) {
    this.showHeaderTitle = this._utilsService.showHeaderTitle;
    const position = event.detail.scrollTop;
    this._utilsService.showTitlePage(position);
  }

}
