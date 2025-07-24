import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDetailLegendOnMapComponent } from './data-detail-legend-on-map.component';

describe('DataDetailLegendOnMapComponent', () => {
  let component: DataDetailLegendOnMapComponent;
  let fixture: ComponentFixture<DataDetailLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataDetailLegendOnMapComponent]
    });
    fixture = TestBed.createComponent(DataDetailLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
