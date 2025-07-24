import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationTargetComponent } from './information-target.component';

describe('InformationTargetComponent', () => {
  let component: InformationTargetComponent;
  let fixture: ComponentFixture<InformationTargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InformationTargetComponent]
    });
    fixture = TestBed.createComponent(InformationTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
