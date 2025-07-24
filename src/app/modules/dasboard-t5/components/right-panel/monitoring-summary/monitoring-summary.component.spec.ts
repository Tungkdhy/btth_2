import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringSummaryComponent } from './monitoring-summary.component';

describe('MonitoringSummaryComponent', () => {
  let component: MonitoringSummaryComponent;
  let fixture: ComponentFixture<MonitoringSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringSummaryComponent]
    });
    fixture = TestBed.createComponent(MonitoringSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
