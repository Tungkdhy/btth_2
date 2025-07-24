import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcmComponent } from './tcm.component';

describe('TcmComponent', () => {
  let component: TcmComponent;
  let fixture: ComponentFixture<TcmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcmComponent]
    });
    fixture = TestBed.createComponent(TcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
