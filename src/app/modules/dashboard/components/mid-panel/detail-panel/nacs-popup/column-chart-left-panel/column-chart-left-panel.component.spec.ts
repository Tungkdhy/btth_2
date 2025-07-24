import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartLeftPanelComponent } from './column-chart-left-panel.component';

describe('ColumnChartLeftPanelComponent', () => {
  let component: ColumnChartLeftPanelComponent;
  let fixture: ComponentFixture<ColumnChartLeftPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColumnChartLeftPanelComponent]
    });
    fixture = TestBed.createComponent(ColumnChartLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
