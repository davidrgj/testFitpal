import { EventEmitter, Injectable } from '@angular/core';
import { Class } from 'src/app/models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  public class!: Class;
  private localStorageKey = 'classes';
  public action: string = '';

  public refreshClasses: EventEmitter<any> = new EventEmitter<any>()

  constructor() { }

  getClass = (): Class => this.class;
  setClass = (classI: Class) => this.class = classI;

  create(classData: Class): void {
    const classes = this.getClassFromLocalStorage();
    classData.id = Date.now();
    classData.created_at = new Date();
    classes.push(classData);
    this.saveClassesToLocalStorage(classes);
  }

  update(classData: Class): void {
    const classes = this.getClassFromLocalStorage();
    const index = classes.findIndex(c => c.id === classData.id);
    if (index !== -1) {
      classData.created_at = classes[index].created_at;
      classes[index] = classData;
      this.saveClassesToLocalStorage(classes);
    }
  }

  delete(classId: number | string): void {
    const classes = this.getClassFromLocalStorage();
    const index = classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      classes.splice(index, 1);
      this.saveClassesToLocalStorage(classes);
    }
  }

  getAll(): Class[] {
    return this.getClassFromLocalStorage();
  }

  private getClassFromLocalStorage(): Class[] {
    const classesJson = localStorage.getItem(this.localStorageKey);
    return classesJson ? JSON.parse(classesJson) : [];
  }

  private saveClassesToLocalStorage(classes: Class[]): void {
    const classesJson = JSON.stringify(classes);
    localStorage.setItem(this.localStorageKey, classesJson);
  }
}
