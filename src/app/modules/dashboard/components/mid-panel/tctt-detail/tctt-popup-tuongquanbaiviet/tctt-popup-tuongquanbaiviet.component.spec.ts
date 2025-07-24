import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupTuongquanbaivietComponent } from './tctt-popup-tuongquanbaiviet.component';

describe('TcttPopupTuongquanbaivietComponent', () => {
  let component: TcttPopupTuongquanbaivietComponent;
  let fixture: ComponentFixture<TcttPopupTuongquanbaivietComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupTuongquanbaivietComponent]
    });
    fixture = TestBed.createComponent(TcttPopupTuongquanbaivietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
