import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastSeverity } from './toast-severity';

describe('ToastSeverity', () => {
  let component: ToastSeverity;
  let fixture: ComponentFixture<ToastSeverity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastSeverity],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastSeverity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
