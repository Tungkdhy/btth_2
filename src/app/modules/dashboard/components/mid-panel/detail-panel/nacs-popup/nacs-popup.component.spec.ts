import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NacsPopupComponent } from './nacs-popup.component';

describe('SwitchPopupComponent', () => {
  let component: NacsPopupComponent;
  let fixture: ComponentFixture<NacsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NacsPopupComponent],
    });
    fixture = TestBed.createComponent(NacsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
