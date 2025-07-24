import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemNongPieChartComponent } from './diem-nong-pie-chart.component';

describe('DiemNongPieChartComponent', () => {
  let component: DiemNongPieChartComponent;
  let fixture: ComponentFixture<DiemNongPieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiemNongPieChartComponent]
    });
    fixture = TestBed.createComponent(DiemNongPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
