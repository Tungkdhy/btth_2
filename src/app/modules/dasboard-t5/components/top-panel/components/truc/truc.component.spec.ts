import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucComponent } from './truc.component';

describe('TrucComponent', () => {
  let component: TrucComponent;
  let fixture: ComponentFixture<TrucComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrucComponent]
    });
    fixture = TestBed.createComponent(TrucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
