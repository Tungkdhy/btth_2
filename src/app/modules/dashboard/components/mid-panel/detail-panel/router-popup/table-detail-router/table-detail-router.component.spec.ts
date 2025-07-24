import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetailRouterComponent } from './table-detail-router.component';

describe('TableDetailRouterComponent', () => {
  let component: TableDetailRouterComponent;
  let fixture: ComponentFixture<TableDetailRouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableDetailRouterComponent]
    });
    fixture = TestBed.createComponent(TableDetailRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
