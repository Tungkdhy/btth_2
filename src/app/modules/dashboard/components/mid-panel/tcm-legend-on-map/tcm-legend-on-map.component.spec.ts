import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TCMLegendOnMapComponent } from './tcm-legend-on-map.component';

describe('TCMLegendOnMapComponent', () => {
  let component: TCMLegendOnMapComponent;
  let fixture: ComponentFixture<TCMLegendOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TCMLegendOnMapComponent],
    });
    fixture = TestBed.createComponent(TCMLegendOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
