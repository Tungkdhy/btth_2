import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttDiemNongPopupComponent } from './tctt-popup-diemnong.component';

describe('TcttDiemNongPopupComponent', () => {
  let component: TcttDiemNongPopupComponent;
  let fixture: ComponentFixture<TcttDiemNongPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttDiemNongPopupComponent],
    });
    fixture = TestBed.createComponent(TcttDiemNongPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
