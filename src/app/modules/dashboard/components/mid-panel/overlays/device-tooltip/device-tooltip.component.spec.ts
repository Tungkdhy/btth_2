import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTooltipComponent } from './device-tooltip.component';

describe('DeviceTooltipComponent', () => {
  let component: DeviceTooltipComponent;
  let fixture: ComponentFixture<DeviceTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceTooltipComponent]
    });
    fixture = TestBed.createComponent(DeviceTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
