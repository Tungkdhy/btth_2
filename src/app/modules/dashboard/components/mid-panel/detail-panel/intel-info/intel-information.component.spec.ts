import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelInformationComponent } from './intel-information.component';

describe('PopUp1Component', () => {
  let component: IntelInformationComponent;
  let fixture: ComponentFixture<IntelInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntelInformationComponent]
    });
    fixture = TestBed.createComponent(IntelInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
