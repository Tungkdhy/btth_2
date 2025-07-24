import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcttBocgoPopupComponent } from './tctt-bocgo-popup.component';

describe('TcttBocgoPopupComponent', () => {
  let component: TcttBocgoPopupComponent;
  let fixture: ComponentFixture<TcttBocgoPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcttBocgoPopupComponent]
    });
    fixture = TestBed.createComponent(TcttBocgoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
