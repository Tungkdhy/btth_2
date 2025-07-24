import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupTuongquanmuctieuComponent } from './tctt-popup-tuongquanmuctieu.component';

describe('TcttPopupTuongquanmuctieuComponent', () => {
  let component: TcttPopupTuongquanmuctieuComponent;
  let fixture: ComponentFixture<TcttPopupTuongquanmuctieuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupTuongquanmuctieuComponent]
    });
    fixture = TestBed.createComponent(TcttPopupTuongquanmuctieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
