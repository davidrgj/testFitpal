import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassFormPage } from './class-form.page';

describe('ClassFormPage', () => {
  let component: ClassFormPage;
  let fixture: ComponentFixture<ClassFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassFormPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
