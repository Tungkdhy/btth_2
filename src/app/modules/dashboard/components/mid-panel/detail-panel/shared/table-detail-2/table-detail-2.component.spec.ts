import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetail2Component } from './table-detail-2.component';

describe('TableDetail2Component', () => {
  let component: TableDetail2Component;
  let fixture: ComponentFixture<TableDetail2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableDetail2Component]
    });
    fixture = TestBed.createComponent(TableDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
