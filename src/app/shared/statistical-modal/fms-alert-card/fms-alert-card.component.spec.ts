import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmsAlertCardComponent } from './fms-alert-card.component';

describe('FmsAlertCardComponent', () => {
  let component: FmsAlertCardComponent;
  let fixture: ComponentFixture<FmsAlertCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FmsAlertCardComponent]
    });
    fixture = TestBed.createComponent(FmsAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
