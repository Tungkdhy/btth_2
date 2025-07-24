import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputOperaComponent } from './form-input-opera.component';

describe('FormInputOperaComponent', () => {
  let component: FormInputOperaComponent;
  let fixture: ComponentFixture<FormInputOperaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormInputOperaComponent]
    });
    fixture = TestBed.createComponent(FormInputOperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
