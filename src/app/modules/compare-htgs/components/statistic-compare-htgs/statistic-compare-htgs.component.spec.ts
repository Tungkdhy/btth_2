import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticCompareHtgsComponent } from './statistic-compare-htgs.component';

describe('StatisticCompareHtgsComponent', () => {
  let component: StatisticCompareHtgsComponent;
  let fixture: ComponentFixture<StatisticCompareHtgsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticCompareHtgsComponent]
    });
    fixture = TestBed.createComponent(StatisticCompareHtgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
