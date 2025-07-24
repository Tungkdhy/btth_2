import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDetailModalComponent } from './process-detail-modal.component';

describe('DetailDeviceCardComponent', () => {
  let component: ProcessDetailModalComponent;
  let fixture: ComponentFixture<ProcessDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProcessDetailModalComponent],
    });
    fixture = TestBed.createComponent(ProcessDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
