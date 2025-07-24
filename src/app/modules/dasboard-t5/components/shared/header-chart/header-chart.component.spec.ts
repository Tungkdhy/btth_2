import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderChartComponent } from './header-chart.component';

describe('HeaderChartComponent', () => {
  let component: HeaderChartComponent;
  let fixture: ComponentFixture<HeaderChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderChartComponent]
    });
    fixture = TestBed.createComponent(HeaderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
