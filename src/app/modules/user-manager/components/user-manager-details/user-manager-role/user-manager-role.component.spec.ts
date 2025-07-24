import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerRoleComponent } from './user-manager-role.component';

describe('UserManagerRoleComponent', () => {
  let component: UserManagerRoleComponent;
  let fixture: ComponentFixture<UserManagerRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerRoleComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
