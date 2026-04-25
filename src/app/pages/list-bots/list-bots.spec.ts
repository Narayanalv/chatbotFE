import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBots } from './list-bots';

describe('ListBots', () => {
  let component: ListBots;
  let fixture: ComponentFixture<ListBots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBots],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
