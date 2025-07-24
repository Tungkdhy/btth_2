import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterPopupComponent } from './router-popup.component';

describe('RouterPopupComponent', () => {
  let component: RouterPopupComponent;
  let fixture: ComponentFixture<RouterPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterPopupComponent]
    });
    fixture = TestBed.createComponent(RouterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
