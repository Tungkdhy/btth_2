import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeunIconUnitComponent } from './neun-icon-unit.component';

describe('NeunImageComponent', () => {
  let component: NeunIconUnitComponent;
  let fixture: ComponentFixture<NeunIconUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NeunIconUnitComponent],
    });
    fixture = TestBed.createComponent(NeunIconUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
