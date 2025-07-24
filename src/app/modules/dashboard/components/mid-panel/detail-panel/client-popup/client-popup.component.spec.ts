import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPopupComponent } from './client-popup.component';

describe('ClientPopupComponent', () => {
  let component: ClientPopupComponent;
  let fixture: ComponentFixture<ClientPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientPopupComponent]
    });
    fixture = TestBed.createComponent(ClientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
