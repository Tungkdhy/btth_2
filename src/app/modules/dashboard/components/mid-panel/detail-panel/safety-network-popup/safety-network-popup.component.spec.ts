import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyNetworkPopupComponent } from './safety-network-popup.component';

describe('SafetyNetworkPopupComponent', () => {
  let component: SafetyNetworkPopupComponent;
  let fixture: ComponentFixture<SafetyNetworkPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafetyNetworkPopupComponent]
    });
    fixture = TestBed.createComponent(SafetyNetworkPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
