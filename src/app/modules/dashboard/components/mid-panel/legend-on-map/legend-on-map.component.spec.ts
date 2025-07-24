import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendOnMapComponent } from './legend-on-map.component';

describe('LegendOnMapComponent', () => {
  let component: LegendOnMapComponent;
  let fixture: ComponentFixture<LegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LegendOnMapComponent]
    });
    fixture = TestBed.createComponent(LegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
