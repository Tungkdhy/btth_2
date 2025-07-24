import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitStrengthPanelComponent } from './unit-strength-panel.component';

describe('UnitStrengthPanelComponent', () => {
  let component: UnitStrengthPanelComponent;
  let fixture: ComponentFixture<UnitStrengthPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitStrengthPanelComponent]
    });
    fixture = TestBed.createComponent(UnitStrengthPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
