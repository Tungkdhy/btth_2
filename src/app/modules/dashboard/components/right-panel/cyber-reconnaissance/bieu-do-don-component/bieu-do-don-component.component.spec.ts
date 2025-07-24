import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BieuDoDonComponentComponent } from './bieu-do-don-component.component';

describe('BieuDoDonComponentComponent', () => {
  let component: BieuDoDonComponentComponent;
  let fixture: ComponentFixture<BieuDoDonComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BieuDoDonComponentComponent]
    });
    fixture = TestBed.createComponent(BieuDoDonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
