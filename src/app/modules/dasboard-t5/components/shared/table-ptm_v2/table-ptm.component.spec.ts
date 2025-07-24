import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePtmComponent } from './table-ptm-v2.component';

describe('TablePtmComponent', () => {
  let component: TablePtmComponent;
  let fixture: ComponentFixture<TablePtmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePtmComponent]
    });
    fixture = TestBed.createComponent(TablePtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
