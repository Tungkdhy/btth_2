import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartIdentPanelComponent } from './line-chart-ident-panel.component';

describe('LineChartIdentPanelComponent', () => {
  let component: LineChartIdentPanelComponent;
  let fixture: ComponentFixture<LineChartIdentPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LineChartIdentPanelComponent]
    });
    fixture = TestBed.createComponent(LineChartIdentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
