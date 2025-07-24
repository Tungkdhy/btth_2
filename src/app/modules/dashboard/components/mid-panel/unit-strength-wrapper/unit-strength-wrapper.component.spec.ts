import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitStrengthWrapperComponent } from './unit-strength-wrapper.component';

describe('UnitStrengthWrapperComponent', () => {
  let component: UnitStrengthWrapperComponent;
  let fixture: ComponentFixture<UnitStrengthWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitStrengthWrapperComponent]
    });
    fixture = TestBed.createComponent(UnitStrengthWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
