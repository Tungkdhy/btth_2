import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInformationPanelComponent } from './contact-information-panel.component';

describe('ContactInformationPanelComponent', () => {
  let component: ContactInformationPanelComponent;
  let fixture: ComponentFixture<ContactInformationPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactInformationPanelComponent]
    });
    fixture = TestBed.createComponent(ContactInformationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
