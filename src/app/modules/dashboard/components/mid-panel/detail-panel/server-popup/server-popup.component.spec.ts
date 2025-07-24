import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPopupComponent } from './server-popup.component';

describe('ServerPopupComponent', () => {
  let component: ServerPopupComponent;
  let fixture: ComponentFixture<ServerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServerPopupComponent]
    });
    fixture = TestBed.createComponent(ServerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
