import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectingTargetInformationComponent } from './protecting-target-information.component';

describe('ProtectingTargetInformationComponent', () => {
  let component: ProtectingTargetInformationComponent;
  let fixture: ComponentFixture<ProtectingTargetInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectingTargetInformationComponent]
    });
    fixture = TestBed.createComponent(ProtectingTargetInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
