import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOperatorComponent } from './search-oper.component';

describe('SearchOperComponent', () => {
  let component: SearchOperatorComponent;
  let fixture: ComponentFixture<SearchOperatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchOperatorComponent],
    });
    fixture = TestBed.createComponent(SearchOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
