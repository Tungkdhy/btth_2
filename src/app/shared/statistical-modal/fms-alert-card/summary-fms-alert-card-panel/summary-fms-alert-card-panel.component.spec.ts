import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryFmsAlertCardPanelComponent } from './summary-fms-alert-card-panel.component';

describe('SummaryFmsAlertCardPanelComponent', () => {
  let component: SummaryFmsAlertCardPanelComponent;
  let fixture: ComponentFixture<SummaryFmsAlertCardPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SummaryFmsAlertCardPanelComponent]
    });
    fixture = TestBed.createComponent(SummaryFmsAlertCardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
