import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartLeftPanelComponent } from './line-chart-left-panel.component';

describe('LineChartLeftPanelComponent', () => {
  let component: LineChartLeftPanelComponent;
  let fixture: ComponentFixture<LineChartLeftPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LineChartLeftPanelComponent]
    });
    fixture = TestBed.createComponent(LineChartLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
