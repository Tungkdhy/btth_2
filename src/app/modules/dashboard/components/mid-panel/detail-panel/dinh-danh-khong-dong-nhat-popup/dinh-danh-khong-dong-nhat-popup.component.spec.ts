import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinhDanhKhongDongNhatPopupComponent } from './dinh-danh-khong-dong-nhat-popup.component';

describe('DinhDanhKhongDongNhatPopupComponent', () => {
  let component: DinhDanhKhongDongNhatPopupComponent;
  let fixture: ComponentFixture<DinhDanhKhongDongNhatPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DinhDanhKhongDongNhatPopupComponent]
    });
    fixture = TestBed.createComponent(DinhDanhKhongDongNhatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
