import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartLeftQuaHanComponent } from './column-chart-qua-han-panel.component';

describe('ColumnChartLeftQuaHanComponent', () => {
  let component: ColumnChartLeftQuaHanComponent;
  let fixture: ComponentFixture<ColumnChartLeftQuaHanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColumnChartLeftQuaHanComponent]
    });
    fixture = TestBed.createComponent(ColumnChartLeftQuaHanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
