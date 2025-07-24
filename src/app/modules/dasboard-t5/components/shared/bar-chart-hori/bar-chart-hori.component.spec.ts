import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartHoriComponent } from './bar-chart-hori.component';

describe('BarChartHoriComponent', () => {
  let component: BarChartHoriComponent;
  let fixture: ComponentFixture<BarChartHoriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarChartHoriComponent]
    });
    fixture = TestBed.createComponent(BarChartHoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
