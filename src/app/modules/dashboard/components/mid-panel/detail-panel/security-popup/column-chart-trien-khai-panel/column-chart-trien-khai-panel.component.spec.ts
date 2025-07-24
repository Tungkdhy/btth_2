import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartTrienKhaiPanelComponent } from './column-chart-trien-khai-panel.component';

describe('ColumnChartTrienKhaiPanelComponent', () => {
  let component: ColumnChartTrienKhaiPanelComponent;
  let fixture: ComponentFixture<ColumnChartTrienKhaiPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColumnChartTrienKhaiPanelComponent]
    });
    fixture = TestBed.createComponent(ColumnChartTrienKhaiPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
