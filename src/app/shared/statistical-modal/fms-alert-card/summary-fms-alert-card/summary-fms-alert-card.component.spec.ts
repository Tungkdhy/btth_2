import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryFmsAlertCardComponent } from './summary-fms-alert-card.component';

describe('SummaryFmsAlertCardComponent', () => {
  let component: SummaryFmsAlertCardComponent;
  let fixture: ComponentFixture<SummaryFmsAlertCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SummaryFmsAlertCardComponent]
    });
    fixture = TestBed.createComponent(SummaryFmsAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
