import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TCMDetailLegendOnMapComponent } from './tcm-detail-legend-on-map.component';

describe('TcmDetailLegendOnMapComponent', () => {
  let component: TCMDetailLegendOnMapComponent;
  let fixture: ComponentFixture<TCMDetailLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TCMDetailLegendOnMapComponent],
    });
    fixture = TestBed.createComponent(TCMDetailLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
