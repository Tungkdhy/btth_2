import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttChithiPopupComponent } from './tctt-chithi-popup.component';

describe('TcttChithiPopupComponent', () => {
  let component: TcttChithiPopupComponent;
  let fixture: ComponentFixture<TcttChithiPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttChithiPopupComponent]
    });
    fixture = TestBed.createComponent(TcttChithiPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
