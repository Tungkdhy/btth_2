import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttPopupKqdangtaiComponent } from './tctt-popup-kqdangtai.component';

describe('TcttPopupKqdangtaiComponent', () => {
  let component: TcttPopupKqdangtaiComponent;
  let fixture: ComponentFixture<TcttPopupKqdangtaiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttPopupKqdangtaiComponent]
    });
    fixture = TestBed.createComponent(TcttPopupKqdangtaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
