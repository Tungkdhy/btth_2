import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceComputerListCardComponent } from './device-computer-list-card.component';

describe('DeviceComputerListCardComponent', () => {
  let component: DeviceComputerListCardComponent;
  let fixture: ComponentFixture<DeviceComputerListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceComputerListCardComponent]
    });
    fixture = TestBed.createComponent(DeviceComputerListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
