import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttTruyenthongPopupComponent } from './tctt-truyenthong-popup.component';

describe('TcttTruyenthongPopupComponent', () => {
  let component: TcttTruyenthongPopupComponent;
  let fixture: ComponentFixture<TcttTruyenthongPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttTruyenthongPopupComponent]
    });
    fixture = TestBed.createComponent(TcttTruyenthongPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
