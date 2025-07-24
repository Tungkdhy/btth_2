import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryMapComponent } from './military-map.component';

describe('MilitaryMapComponent', () => {
  let component: MilitaryMapComponent;
  let fixture: ComponentFixture<MilitaryMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MilitaryMapComponent]
    });
    fixture = TestBed.createComponent(MilitaryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
