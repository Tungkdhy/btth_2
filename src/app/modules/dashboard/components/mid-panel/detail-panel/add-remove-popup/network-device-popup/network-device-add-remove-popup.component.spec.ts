import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDeviceAddRemovePopupComponent } from './network-device-add-remove-popup.component';

describe('NetworkDeviceAddRemovePopupComponent', () => {
  let component: NetworkDeviceAddRemovePopupComponent;
  let fixture: ComponentFixture<NetworkDeviceAddRemovePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkDeviceAddRemovePopupComponent]
    });
    fixture = TestBed.createComponent(NetworkDeviceAddRemovePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
