import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VktbDetailLegendOnMapComponent } from './vktb-detail-legend-on-map.component';

describe('VktbDetailLegendOnMapComponent', () => {
  let component: VktbDetailLegendOnMapComponent;
  let fixture: ComponentFixture<VktbDetailLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VktbDetailLegendOnMapComponent]
    });
    fixture = TestBed.createComponent(VktbDetailLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
