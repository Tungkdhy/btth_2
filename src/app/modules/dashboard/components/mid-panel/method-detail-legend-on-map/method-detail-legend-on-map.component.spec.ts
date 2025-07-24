import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodDetailLegendOnMapComponent } from './method-detail-legend-on-map.component';

describe('MethodDetailLegendOnMapComponent', () => {
  let component: MethodDetailLegendOnMapComponent;
  let fixture: ComponentFixture<MethodDetailLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MethodDetailLegendOnMapComponent]
    });
    fixture = TestBed.createComponent(MethodDetailLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
