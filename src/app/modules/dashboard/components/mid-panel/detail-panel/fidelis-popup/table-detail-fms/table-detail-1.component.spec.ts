import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetail1Component } from './table-detail-1.component';

describe('TableDetail1Component', () => {
  let component: TableDetail1Component;
  let fixture: ComponentFixture<TableDetail1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableDetail1Component]
    });
    fixture = TestBed.createComponent(TableDetail1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
