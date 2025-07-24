import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackChartComponent } from './stack-chart.component';

describe('StackChartComponent', () => {
  let component: StackChartComponent;
  let fixture: ComponentFixture<StackChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StackChartComponent]
    });
    fixture = TestBed.createComponent(StackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
