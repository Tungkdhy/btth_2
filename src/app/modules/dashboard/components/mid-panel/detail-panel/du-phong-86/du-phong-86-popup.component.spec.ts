import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuPhong86PopupComponent } from './du-phong-86-popup.component';

describe('SwitchPopupComponent', () => {
  let component: DuPhong86PopupComponent;
  let fixture: ComponentFixture<DuPhong86PopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DuPhong86PopupComponent],
    });
    fixture = TestBed.createComponent(DuPhong86PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
