import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BieuDoBvTieuCucComponent } from './bieu-do-bv-tieu-cuc.component';

describe('BieuDoBvTieuCucComponent', () => {
  let component: BieuDoBvTieuCucComponent;
  let fixture: ComponentFixture<BieuDoBvTieuCucComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BieuDoBvTieuCucComponent]
    });
    fixture = TestBed.createComponent(BieuDoBvTieuCucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
