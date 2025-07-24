import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartLeftPanelComponent } from './pie-chart-left-panel.component';

describe('PieChartLeftPanelComponent', () => {
  let component: PieChartLeftPanelComponent;
  let fixture: ComponentFixture<PieChartLeftPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PieChartLeftPanelComponent]
    });
    fixture = TestBed.createComponent(PieChartLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
