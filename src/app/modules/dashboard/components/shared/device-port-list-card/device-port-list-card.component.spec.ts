import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePortListCardComponent } from './device-port-list-card.component';

describe('DevicePortListCardComponent', () => {
  let component: DevicePortListCardComponent;
  let fixture: ComponentFixture<DevicePortListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DevicePortListCardComponent]
    });
    fixture = TestBed.createComponent(DevicePortListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
