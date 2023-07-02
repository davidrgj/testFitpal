import { EventEmitter, Injectable } from '@angular/core';
import { Schedule } from 'src/app/models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private localStorageKey = 'schedules';
  schedules: Schedule[] = [];
  schedule!: Schedule;

  public refreshSchedules: EventEmitter<any> = new EventEmitter<any>()


  constructor() { }

  getSchedule = (): Schedule => this.schedule;
  setSchedule = (schedule: Schedule) => this.schedule = schedule;

  create(scheduleData: Schedule): void {
    const newSchedule: Schedule = {
      id: Date.now(),
      class_id: scheduleData.class_id,
      date: scheduleData.date
    };

    const schedules = this.getSchedulesFromLocalStorage();
    schedules.push(newSchedule);
    this.saveSchedulesToLocalStorage(schedules);
  }

  update(scheduleId: number | string, scheduleData: Schedule): void {
    const schedules = this.getSchedulesFromLocalStorage();
    const index = schedules.findIndex(s => s.id === scheduleId);
    if (index !== -1) {
      schedules[index] = scheduleData;
      this.saveSchedulesToLocalStorage(schedules);
    }
  }

  delete(scheduleId: number | string): void {
    const schedules = this.getSchedulesFromLocalStorage();
    const index = schedules.findIndex(s => s.id === scheduleId);
    if (index !== -1) {
      schedules.splice(index, 1);
      this.saveSchedulesToLocalStorage(schedules);
    }
  }

  getAll(): Schedule[] {
    return this.getSchedulesFromLocalStorage();
  }

  private getSchedulesFromLocalStorage(): Schedule[] {
    const schedulesJson = localStorage.getItem(this.localStorageKey);
    return schedulesJson ? JSON.parse(schedulesJson) : [];
  }

  private saveSchedulesToLocalStorage(schedules: Schedule[]): void {
    const schedulesJson = JSON.stringify(schedules);
    localStorage.setItem(this.localStorageKey, schedulesJson);
  }

  getTimeString(date: Date): string {
    const hora = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return hora + ':' + minutos;
  }
}
