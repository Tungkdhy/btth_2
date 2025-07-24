import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtmComponent } from './mangqs.component';

describe('PtmComponent', () => {
  let component: PtmComponent;
  let fixture: ComponentFixture<PtmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtmComponent]
    });
    fixture = TestBed.createComponent(PtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
