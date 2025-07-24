import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDeviceModalComponent } from './detail-device-modal.component';

describe('DetailDeviceCardComponent', () => {
  let component: DetailDeviceModalComponent;
  let fixture: ComponentFixture<DetailDeviceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailDeviceModalComponent],
    });
    fixture = TestBed.createComponent(DetailDeviceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
