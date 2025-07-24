import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalDetailCommandComponent } from './operational-command.component';

describe('OperationalCommandComponent', () => {
  let component: OperationalDetailCommandComponent;
  let fixture: ComponentFixture<OperationalDetailCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OperationalDetailCommandComponent],
    });
    fixture = TestBed.createComponent(OperationalDetailCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
