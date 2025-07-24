import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNhiemVuFullPopupComponent } from './chi-tiet-nhiem-vu-full-popup.component';

describe('SwitchPopupComponent', () => {
  let component: ChiTietNhiemVuFullPopupComponent;
  let fixture: ComponentFixture<ChiTietNhiemVuFullPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChiTietNhiemVuFullPopupComponent],
    });
    fixture = TestBed.createComponent(ChiTietNhiemVuFullPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
