import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerFormComponent } from './user-manager-form.component';

describe('UserManagerFormComponent', () => {
  let component: UserManagerFormComponent;
  let fixture: ComponentFixture<UserManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
