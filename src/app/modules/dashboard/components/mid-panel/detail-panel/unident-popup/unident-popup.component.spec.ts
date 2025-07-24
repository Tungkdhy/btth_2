import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidentPopupComponent } from './unident-popup.component';

describe('UnidentPopupComponent', () => {
  let component: UnidentPopupComponent;
  let fixture: ComponentFixture<UnidentPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnidentPopupComponent]
    });
    fixture = TestBed.createComponent(UnidentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
