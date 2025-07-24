import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDevicePopupComponent } from './other-device-popup.component';

describe('OtherDevicePopupComponent', () => {
  let component: OtherDevicePopupComponent;
  let fixture: ComponentFixture<OtherDevicePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OtherDevicePopupComponent]
    });
    fixture = TestBed.createComponent(OtherDevicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
