import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectingTargetModalComponent } from './protecting-target-modal.component';

describe('ProtectingTargetModalComponent', () => {
  let component: ProtectingTargetModalComponent;
  let fixture: ComponentFixture<ProtectingTargetModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectingTargetModalComponent]
    });
    fixture = TestBed.createComponent(ProtectingTargetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
