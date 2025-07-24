import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PheDuyetHoSoPopupComponent } from './phe-duyet-ho-so-popup.component';

describe('PheDuyetHoSoPopupComponent', () => {
  let component: PheDuyetHoSoPopupComponent;
  let fixture: ComponentFixture<PheDuyetHoSoPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PheDuyetHoSoPopupComponent]
    });
    fixture = TestBed.createComponent(PheDuyetHoSoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
