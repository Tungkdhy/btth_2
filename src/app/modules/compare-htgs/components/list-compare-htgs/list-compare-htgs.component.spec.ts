import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompareHtgsComponent } from './list-compare-htgs.component';

describe('ListCompareHtgsComponent', () => {
  let component: ListCompareHtgsComponent;
  let fixture: ComponentFixture<ListCompareHtgsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListCompareHtgsComponent]
    });
    fixture = TestBed.createComponent(ListCompareHtgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
