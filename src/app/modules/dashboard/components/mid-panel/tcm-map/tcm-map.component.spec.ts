import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TCMMapComponent } from './tcm-map.component';

describe('TCMMapComponent', () => {
  let component: TCMMapComponent;
  let fixture: ComponentFixture<TCMMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TCMMapComponent],
    });
    fixture = TestBed.createComponent(TCMMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
