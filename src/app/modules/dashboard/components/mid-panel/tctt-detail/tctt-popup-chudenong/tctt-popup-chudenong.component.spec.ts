import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupChudenongComponent } from './tctt-popup-chudenong.component';

describe('TcttPopupChudenongComponent', () => {
  let component: TcttPopupChudenongComponent;
  let fixture: ComponentFixture<TcttPopupChudenongComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupChudenongComponent]
    });
    fixture = TestBed.createComponent(TcttPopupChudenongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
