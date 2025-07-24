import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupComponent } from './tctt-popup.component';

describe('TcttPopupComponent', () => {
  let component: TcttPopupComponent;
  let fixture: ComponentFixture<TcttPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupComponent]
    });
    fixture = TestBed.createComponent(TcttPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
