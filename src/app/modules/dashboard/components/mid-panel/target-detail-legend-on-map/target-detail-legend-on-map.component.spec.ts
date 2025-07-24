import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetDetailLegendOnMapComponent } from './target-detail-legend-on-map.component';

describe('TargetDetailLegendOnMapComponent', () => {
  let component: TargetDetailLegendOnMapComponent;
  let fixture: ComponentFixture<TargetDetailLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TargetDetailLegendOnMapComponent]
    });
    fixture = TestBed.createComponent(TargetDetailLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
