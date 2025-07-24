import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartConTonPanelComponent } from './column-chart-con-ton-panel.component';

describe('ColumnChartConTonPanelComponent', () => {
  let component: ColumnChartConTonPanelComponent;
  let fixture: ComponentFixture<ColumnChartConTonPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColumnChartConTonPanelComponent]
    });
    fixture = TestBed.createComponent(ColumnChartConTonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
