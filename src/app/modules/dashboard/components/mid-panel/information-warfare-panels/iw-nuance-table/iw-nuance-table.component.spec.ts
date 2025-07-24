import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IwNuanceTableComponent } from './iw-nuance-table.component';

describe('IwNuanceTableComponent', () => {
  let component: IwNuanceTableComponent;
  let fixture: ComponentFixture<IwNuanceTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IwNuanceTableComponent]
    });
    fixture = TestBed.createComponent(IwNuanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
