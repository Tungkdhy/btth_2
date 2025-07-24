import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupSacthaiComponent } from './tctt-popup-sacthai.component';

describe('TcttPopupSacthaiComponent', () => {
  let component: TcttPopupSacthaiComponent;
  let fixture: ComponentFixture<TcttPopupSacthaiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupSacthaiComponent]
    });
    fixture = TestBed.createComponent(TcttPopupSacthaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
