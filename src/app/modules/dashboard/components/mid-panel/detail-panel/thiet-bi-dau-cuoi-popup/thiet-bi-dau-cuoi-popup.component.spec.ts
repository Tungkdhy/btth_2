import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietBiDauCuoiPopupComponent } from './thiet-bi-dau-cuoi-popup.component';

describe('ThietBiDauCuoiPopupComponent', () => {
  let component: ThietBiDauCuoiPopupComponent;
  let fixture: ComponentFixture<ThietBiDauCuoiPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThietBiDauCuoiPopupComponent]
    });
    fixture = TestBed.createComponent(ThietBiDauCuoiPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
