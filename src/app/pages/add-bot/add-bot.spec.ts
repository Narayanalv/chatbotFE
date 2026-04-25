import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBot } from './add-bot';

describe('AddBot', () => {
  let component: AddBot;
  let fixture: ComponentFixture<AddBot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBot],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
