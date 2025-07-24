import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertListCardComponent } from './alert-list-card.component';

describe('AlertListCardComponent', () => {
  let component: AlertListCardComponent;
  let fixture: ComponentFixture<AlertListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertListCardComponent]
    });
    fixture = TestBed.createComponent(AlertListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
