import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsComponent } from './ts.component';

describe('TsComponent', () => {
  let component: TsComponent;
  let fixture: ComponentFixture<TsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TsComponent]
    });
    fixture = TestBed.createComponent(TsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
