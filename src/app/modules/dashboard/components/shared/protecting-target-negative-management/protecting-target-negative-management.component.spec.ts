import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectingTargetNegativeManagementComponent } from './protecting-target-negative-management.component';

describe('ProtectingTargetNegativeManagementComponent', () => {
  let component: ProtectingTargetNegativeManagementComponent;
  let fixture: ComponentFixture<ProtectingTargetNegativeManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectingTargetNegativeManagementComponent]
    });
    fixture = TestBed.createComponent(ProtectingTargetNegativeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
