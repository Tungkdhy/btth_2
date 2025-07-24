import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInfoCardComponent } from './device-info-card.component';

describe('DeviceInfoCardComponent', () => {
  let component: DeviceInfoCardComponent;
  let fixture: ComponentFixture<DeviceInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceInfoCardComponent]
    });
    fixture = TestBed.createComponent(DeviceInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
