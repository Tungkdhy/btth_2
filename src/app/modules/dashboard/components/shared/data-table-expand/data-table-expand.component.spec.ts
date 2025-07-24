import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableExpandComponent } from './data-table-expand.component';

describe('DataTableExpandComponent', () => {
  let component: DataTableExpandComponent;
  let fixture: ComponentFixture<DataTableExpandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableExpandComponent]
    });
    fixture = TestBed.createComponent(DataTableExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
