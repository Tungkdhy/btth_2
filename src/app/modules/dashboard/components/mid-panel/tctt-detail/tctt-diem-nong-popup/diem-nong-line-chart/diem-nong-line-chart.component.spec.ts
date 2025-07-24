import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemNongLineChartComponent } from './diem-nong-line-chart.component';

describe('DiemNongLineChartComponent', () => {
  let component: DiemNongLineChartComponent;
  let fixture: ComponentFixture<DiemNongLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiemNongLineChartComponent]
    });
    fixture = TestBed.createComponent(DiemNongLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
